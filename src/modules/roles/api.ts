import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { Permiso, PermisosRolRequest, RolDetalle, RolRequest, RolResponse } from './types'

const RUTA_ROLES = '/roles'

// Los roles no se crean ni se borran
export const rolesApi = {
    listar: async (activo?: boolean): Promise<RolResponse[]> => {
        const { data } = await api.get<ApiResponse<RolResponse[]>>(RUTA_ROLES, { params: { activo } })
        return data.datos
    },
    obtener: async (id: number): Promise<RolDetalle> => {
        const { data } = await api.get<ApiResponse<RolDetalle>>(`${RUTA_ROLES}/${id}`)
        return data.datos
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
