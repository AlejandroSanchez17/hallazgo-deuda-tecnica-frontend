import { useSesionStore } from '../../store/sesionStore'
import type { ApiResponse } from '../../types/api.types'
import type { UsuarioActual, UsuarioSimulable } from '../../types/usuario.types'
import { aErrorApi, api, type ErrorApi } from './index'

export const obtenerUsuarioActual = async (): Promise<UsuarioActual> => {
    const { data } = await api.get<ApiResponse<UsuarioActual>>('/usuarios/me')
    return data.datos
}

export const obtenerUsuariosSimulables = async (): Promise<UsuarioSimulable[]> => {
    const { data } = await api.get<ApiResponse<UsuarioSimulable[]>>('/usuarios/simulables')
    return data.datos
}

let ultimaSolicitud = 0
let cargaInicial: Promise<ErrorApi | null> | null = null

// Vuelve a pedir la lista del selector y la guarda en el store. Se llama despues de cambiar usuarios o roles.
// Devuelve el error, si lo hubo (el interceptor ya lo avisa); con un error se conserva la lista actual
export const recargarUsuariosSimulables = async (): Promise<ErrorApi | null> => {
    const solicitud = ++ultimaSolicitud
    try {
        const usuarios = await obtenerUsuariosSimulables()
        // Si ya salio una recarga mas reciente, la respuesta vieja se descarta
        if (solicitud === ultimaSolicitud) {
            useSesionStore.getState().guardarUsuariosSimulables(usuarios)
        }
        return null
    } catch (error) {
        return aErrorApi(error)
    }
}

// Primera carga: el Header y el menu movil la piden a la vez y comparten una sola peticion
export const cargarUsuariosSimulables = (): Promise<ErrorApi | null> => {
    if (useSesionStore.getState().usuariosSimulables !== null) {
        return Promise.resolve(null)
    }
    cargaInicial ??= recargarUsuariosSimulables().finally(() => {
        cargaInicial = null
    })
    return cargaInicial
}
