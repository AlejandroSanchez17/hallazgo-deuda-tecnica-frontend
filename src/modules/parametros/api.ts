import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { ParametroResponse, RolActivo } from './types'

const RUTA_PARAMETROS = '/parametros'

export const listarParametros = async (): Promise<ParametroResponse[]> => {
    const { data } = await api.get<ApiResponse<ParametroResponse[]>>(RUTA_PARAMETROS)
    return data.datos
}

// Solo para el selector del parametro que guarda un rol; los roles se administran en el modulo roles
export const listarRolesActivos = async (): Promise<RolActivo[]> => {
    const { data } = await api.get<ApiResponse<RolActivo[]>>('/roles', { params: { activo: true } })
    return data.datos
}

// El valor siempre viaja como texto; el backend lo valida segun el tipo de dato
export const actualizarParametro = async (clave: string, valor: string): Promise<ParametroResponse> => {
    const { data } = await api.put<ApiResponse<ParametroResponse>>(`${RUTA_PARAMETROS}/${clave}`, { valor })
    return data.datos
}
