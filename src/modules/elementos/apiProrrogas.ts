import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type {
    CierreResponse,
    DecisionCierre,
    DecisionProrroga,
    PendienteResponse,
    ProrrogaRequest,
    ProrrogaResponse,
    ProrrogasDelElemento,
} from './typesProrroga'

const rutaElemento = (elementoId: number) => `/elementos/${elementoId}`

// Las acciones devuelven el mensaje del backend para el aviso ("Prórroga aprobada; la fecha compromiso pasa al …")
export const prorrogasApi = {
    delElemento: async (elementoId: number): Promise<ProrrogasDelElemento> => {
        const { data } = await api.get<ApiResponse<ProrrogasDelElemento>>(`${rutaElemento(elementoId)}/prorrogas`)
        return data.datos
    },
    pedir: async (elementoId: number, solicitud: ProrrogaRequest): Promise<string> => {
        const { data } = await api.post<ApiResponse<ProrrogaResponse>>(
            `${rutaElemento(elementoId)}/prorrogas`,
            solicitud,
        )
        return data.mensaje
    },
    // Al rechazar, el comentario es obligatorio
    resolver: async (prorrogaId: number, resultado: DecisionProrroga, comentario?: string): Promise<string> => {
        const { data } = await api.post<ApiResponse<ProrrogaResponse>>(`/prorrogas/${prorrogaId}/resolucion`, {
            resultado,
            comentario,
        })
        return data.mensaje
    },
}

export const cierresApi = {
    delElemento: async (elementoId: number): Promise<CierreResponse[]> => {
        const { data } = await api.get<ApiResponse<CierreResponse[]>>(`${rutaElemento(elementoId)}/cierres`)
        return data.datos
    },
    // Sin cuerpo; si falta algo, 422 con un error por problema (tareas, evidencia, prorroga, estado)
    pedir: async (elementoId: number): Promise<string> => {
        const { data } = await api.post<ApiResponse<CierreResponse>>(`${rutaElemento(elementoId)}/solicitud-cierre`)
        return data.mensaje
    },
    // Al rechazar, el comentario es obligatorio
    validar: async (elementoId: number, resultado: DecisionCierre, comentario?: string): Promise<string> => {
        const { data } = await api.post<ApiResponse<CierreResponse>>(`${rutaElemento(elementoId)}/validacion-cierre`, {
            resultado,
            comentario,
        })
        return data.mensaje
    },
}

export const aprobacionesApi = {
    pendientes: async (): Promise<PendienteResponse[]> => {
        const { data } = await api.get<ApiResponse<PendienteResponse[]>>('/aprobaciones/pendientes')
        return data.datos
    },
}
