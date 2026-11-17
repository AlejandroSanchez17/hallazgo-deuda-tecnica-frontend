import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type {
    AreaDisponible,
    CandidatoResponse,
    EquipoActualizarRequest,
    EquipoCrearRequest,
    EquipoDetalleResponse,
    EquipoResponse,
    LiderRequest,
    MiembroRequest,
    MiembroResponse,
} from './types'

const RUTA_EQUIPOS = '/equipos'

export const equiposApi = {
    listar: async (activo?: boolean): Promise<EquipoResponse[]> => {
        const { data } = await api.get<ApiResponse<EquipoResponse[]>>(RUTA_EQUIPOS, { params: { activo } })
        return data.datos
    },
    obtener: async (id: number): Promise<EquipoDetalleResponse> => {
        const { data } = await api.get<ApiResponse<EquipoDetalleResponse>>(`${RUTA_EQUIPOS}/${id}`)
        return data.datos
    },
    crear: async (solicitud: EquipoCrearRequest): Promise<EquipoResponse> => {
        const { data } = await api.post<ApiResponse<EquipoResponse>>(RUTA_EQUIPOS, solicitud)
        return data.datos
    },
    actualizar: async (id: number, solicitud: EquipoActualizarRequest): Promise<EquipoResponse> => {
        const { data } = await api.put<ApiResponse<EquipoResponse>>(`${RUTA_EQUIPOS}/${id}`, solicitud)
        return data.datos
    },
    cambiarEstado: async (id: number, activo: boolean): Promise<EquipoResponse> => {
        const { data } = await api.patch<ApiResponse<EquipoResponse>>(`${RUTA_EQUIPOS}/${id}/estado`, { activo })
        return data.datos
    },
    // Devuelve el mensaje, que dice cuantos elementos abiertos pasaron al nuevo lider
    cambiarLider: async (id: number, solicitud: LiderRequest): Promise<string> => {
        const { data } = await api.put<ApiResponse<EquipoDetalleResponse>>(`${RUTA_EQUIPOS}/${id}/lider`, solicitud)
        return data.mensaje
    },
    // Con incluirRetirados tambien llegan los que ya salieron (historial)
    listarMiembros: async (id: number, incluirRetirados = false): Promise<MiembroResponse[]> => {
        const { data } = await api.get<ApiResponse<MiembroResponse[]>>(`${RUTA_EQUIPOS}/${id}/miembros`, {
            params: { incluirRetirados: incluirRetirados || undefined },
        })
        return data.datos
    },
    // Historial de lideres, el vigente primero
    listarLideres: async (id: number): Promise<MiembroResponse[]> => {
        const { data } = await api.get<ApiResponse<MiembroResponse[]>>(`${RUTA_EQUIPOS}/${id}/lideres`)
        return data.datos
    },
    agregarMiembro: async (id: number, solicitud: MiembroRequest): Promise<MiembroResponse> => {
        const { data } = await api.post<ApiResponse<MiembroResponse>>(`${RUTA_EQUIPOS}/${id}/miembros`, solicitud)
        return data.datos
    },
    // Sin fecha, el backend usa la de hoy. El mensaje dice si sus elementos abiertos pasaron al lider del equipo
    retirarMiembro: async (id: number, usuarioId: number): Promise<string> => {
        const { data } = await api.patch<ApiResponse<MiembroResponse>>(
            `${RUTA_EQUIPOS}/${id}/miembros/${usuarioId}/salida`,
        )
        return data.mensaje
    },
    // Para agregar un miembro, o para el lider con LIDER (alcance TODO); el backend ya quita a los que tienen otro equipo
    candidatos: async (id: number, para?: 'LIDER'): Promise<CandidatoResponse[]> => {
        const { data } = await api.get<ApiResponse<CandidatoResponse[]>>(`${RUTA_EQUIPOS}/${id}/candidatos`, {
            params: { para },
        })
        return data.datos
    },
    candidatosLiderNuevoEquipo: async (): Promise<CandidatoResponse[]> => {
        const { data } = await api.get<ApiResponse<CandidatoResponse[]>>(`${RUTA_EQUIPOS}/candidatos-lider`)
        return data.datos
    },
}

// Solo para el combo de area; las areas se administran en el modulo catalogos
export const areasApi = {
    listar: async (activo?: boolean): Promise<AreaDisponible[]> => {
        const { data } = await api.get<ApiResponse<AreaDisponible[]>>('/catalogos/areas', { params: { activo } })
        return data.datos
    },
}
