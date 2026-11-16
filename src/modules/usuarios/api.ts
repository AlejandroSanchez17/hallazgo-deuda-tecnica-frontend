import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { RolDisponible, UsuarioRequest, UsuarioResponse } from './types'

const RUTA_USUARIOS = '/usuarios'

export const usuariosApi = {
    listar: async (activo?: boolean): Promise<UsuarioResponse[]> => {
        const { data } = await api.get<ApiResponse<UsuarioResponse[]>>(RUTA_USUARIOS, { params: { activo } })
        return data.datos
    },
    crear: async (solicitud: UsuarioRequest): Promise<UsuarioResponse> => {
        const { data } = await api.post<ApiResponse<UsuarioResponse>>(RUTA_USUARIOS, solicitud)
        return data.datos
    },
    actualizar: async (id: number, solicitud: UsuarioRequest): Promise<UsuarioResponse> => {
        const { data } = await api.put<ApiResponse<UsuarioResponse>>(`${RUTA_USUARIOS}/${id}`, solicitud)
        return data.datos
    },
    cambiarEstado: async (id: number, activo: boolean): Promise<UsuarioResponse> => {
        const { data } = await api.patch<ApiResponse<UsuarioResponse>>(`${RUTA_USUARIOS}/${id}/estado`, { activo })
        return data.datos
    },
}

// Solo para el combo de roles del formulario; los roles se administran en el modulo roles
export const rolesApi = {
    listar: async (activo?: boolean): Promise<RolDisponible[]> => {
        const { data } = await api.get<ApiResponse<RolDisponible[]>>('/roles', { params: { activo } })
        return data.datos
    },
}
