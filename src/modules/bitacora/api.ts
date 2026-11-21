import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { PaginaBitacora, UsuarioCombo } from './types'

const RUTA_BITACORA = '/bitacora'

export const bitacoraApi = {
    // pagina desde 0; consulta ya sin los filtros vacios (ver aConsulta en filtros.ts)
    listar: async (pagina: number, tamano: number, consulta: Record<string, string>): Promise<PaginaBitacora> => {
        const { data } = await api.get<ApiResponse<PaginaBitacora>>(RUTA_BITACORA, {
            params: { ...consulta, pagina, tamano },
        })
        return data.datos
    },
    // Nombres de tabla con registros, para el combo de entidad
    entidades: async (): Promise<string[]> => {
        const { data } = await api.get<ApiResponse<string[]>>(`${RUTA_BITACORA}/entidades`)
        return data.datos
    },
}

// Solo para el combo de usuario; los usuarios se administran en el modulo usuarios.
// Exige USUARIO:LEER: sin el permiso la pantalla no ofrece este filtro
export const usuariosComboApi = {
    listar: async (): Promise<UsuarioCombo[]> => {
        const { data } = await api.get<ApiResponse<UsuarioCombo[]>>('/usuarios')
        return data.datos
    },
}
