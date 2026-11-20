import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { Permiso, PermisosRolRequest, RolDetalle, RolRequest, RolResponse } from './types'

const RUTA_ROLES = '/roles'

export const rolesApi = {
    listar: async (activo?: boolean): Promise<RolResponse[]> => {
        const { data } = await api.get<ApiResponse<RolResponse[]>>(RUTA_ROLES, { params: { activo } })
        return data.datos
    },
    obtener: async (id: number): Promise<RolDetalle> => {
        const { data } = await api.get<ApiResponse<RolDetalle>>(`${RUTA_ROLES}/${id}`)
        return data.datos
    },
    // Llega sin permisos y sin codigo
    crear: async (solicitud: RolRequest): Promise<RolResponse> => {
        const { data } = await api.post<ApiResponse<RolResponse>>(RUTA_ROLES, solicitud)
        return data.datos
    },
    // 422 si esta en uso (usuarios, criticidades, validacion de hallazgos o aprobaciones): el mensaje dice el motivo
    borrar: async (id: number): Promise<void> => {
        await api.delete(`${RUTA_ROLES}/${id}`)
    },
    actualizar: async (id: number, solicitud: RolRequest): Promise<RolResponse> => {
        const { data } = await api.put<ApiResponse<RolResponse>>(`${RUTA_ROLES}/${id}`, solicitud)
        return data.datos
    },
    cambiarEstado: async (id: number, activo: boolean): Promise<RolResponse> => {
        const { data } = await api.patch<ApiResponse<RolResponse>>(`${RUTA_ROLES}/${id}/estado`, { activo })
        return data.datos
    },
    guardarPermisos: async (id: number, solicitud: PermisosRolRequest): Promise<RolDetalle> => {
        const { data } = await api.put<ApiResponse<RolDetalle>>(`${RUTA_ROLES}/${id}/permisos`, solicitud)
        return data.datos
    },
}

export const permisosApi = {
    listar: async (): Promise<Permiso[]> => {
        const { data } = await api.get<ApiResponse<Permiso[]>>('/permisos')
        return data.datos
    },
}
