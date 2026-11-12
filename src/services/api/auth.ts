import type { ApiResponse } from '../../types/api.types'
import type { UsuarioActual, UsuarioSimulable } from '../../types/usuario.types'
import { api } from './index'

export const obtenerUsuarioActual = async (): Promise<UsuarioActual> => {
    const { data } = await api.get<ApiResponse<UsuarioActual>>('/usuarios/me')
    return data.datos
}

export const obtenerUsuariosSimulables = async (): Promise<UsuarioSimulable[]> => {
    const { data } = await api.get<ApiResponse<UsuarioSimulable[]>>('/usuarios/simulables')
    return data.datos
}
