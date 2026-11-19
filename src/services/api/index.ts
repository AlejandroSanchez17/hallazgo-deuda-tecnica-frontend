import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { env } from '../../config/env'
import { useNotificacionesStore } from '../../store/notificacionesStore'
import { useSesionStore } from '../../store/sesionStore'
import type { ApiResponse, ErrorCampo } from '../../types/api.types'
import { avisarError } from '../../utils/alertas'

declare module 'axios' {
    interface AxiosRequestConfig {
        // Consultas de fondo (el contador de la campana): sus errores no se avisan, para no repetirlos cada minuto
        silencioso?: boolean
    }
}

export class ErrorApi extends Error {
    readonly estado: number
    readonly mensaje: string
    readonly errores: ErrorCampo[]

    constructor(estado: number, mensaje: string, errores: ErrorCampo[] = []) {
        super(mensaje)
        this.name = 'ErrorApi'
        this.estado = estado
        this.mensaje = mensaje
        this.errores = errores
    }
}

export const aErrorApi = (error: unknown): ErrorApi =>
    error instanceof ErrorApi ? error : new ErrorApi(0, 'Ocurrió un error inesperado')

const convertirError = (error: AxiosError<ApiResponse<unknown>>): ErrorApi => {
    if (!error.response) {
        return new ErrorApi(0, 'No se pudo conectar con el servidor')
    }
    const { status, data } = error.response
    // Algunos 403 explican el motivo (por ejemplo, un equipo ajeno con alcance PROPIO)
    if (status === 403) {
        return new ErrorApi(status, data?.mensaje ?? 'No tiene permiso para esta acción')
    }
    if (status >= 500) {
        return new ErrorApi(status, 'Ocurrió un error en el servidor. Intente de nuevo')
    }
    return new ErrorApi(status, data?.mensaje ?? 'No se pudo completar la solicitud', data?.errores ?? [])
}

// 400, 404, 409 y 422 los muestra cada pantalla, porque pueden marcar un campo
const seAvisaEnTodaLaApp = (estado: number) => estado === 0 || estado === 401 || estado === 403 || estado >= 500

// Para que una pantalla avise su error sin repetir el aviso que ya mostro el interceptor
export const avisarSiNoSeAviso = (errorApi: ErrorApi) => {
    if (!seAvisaEnTodaLaApp(errorApi.estado)) {
        void avisarError(errorApi.mensaje)
    }
}

export const api = axios.create({ baseURL: env.apiUrl, timeout: 15000 })

api.interceptors.request.use((config) => {
    const usuarioId = useSesionStore.getState().usuarioSimuladoId
    if (usuarioId !== null) {
        config.headers.set('X-Usuario-Id', String(usuarioId))
    }
    return config
})

// Con responseType 'blob' (descargas) el error tambien llega como Blob: se lee para tener el mensaje del backend
const leerErrorEnBlob = async (error: AxiosError<ApiResponse<unknown>>) => {
    const datos: unknown = error.response?.data
    if (error.response && datos instanceof Blob) {
        try {
            error.response.data = JSON.parse(await datos.text()) as ApiResponse<unknown>
        } catch {
            error.response.data = undefined as unknown as ApiResponse<unknown>
        }
    }
}

let refrescoPendiente: number | undefined

// Una accion (registrar, reasignar, enviar, aprobar…) puede generar avisos: se vuelve a pedir el contador una sola
// vez aunque la pantalla haga varias peticiones seguidas
const refrescarContadorDespuesDe = (respuesta: AxiosResponse) => {
    const metodo = respuesta.config.method ?? 'get'
    if (metodo === 'get' || respuesta.config.url?.startsWith('/notificaciones')) {
        return
    }
    window.clearTimeout(refrescoPendiente)
    refrescoPendiente = window.setTimeout(() => useNotificacionesStore.getState().pedirRefresco(), 1000)
}

api.interceptors.response.use(
    (respuesta) => {
        refrescarContadorDespuesDe(respuesta)
        return respuesta
    },
    async (error: AxiosError<ApiResponse<unknown>>) => {
        await leerErrorEnBlob(error)
        const errorApi = convertirError(error)
        if (errorApi.estado === 401) {
            useSesionStore.getState().cerrarSesion()
        }
        if (seAvisaEnTodaLaApp(errorApi.estado) && !error.config?.silencioso) {
            void avisarError(errorApi.mensaje)
        }
        return Promise.reject(errorApi)
    },
)
