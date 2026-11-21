import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { TableroResponse } from './types'

export const tableroApi = {
    // consulta: solo los filtros con valor (aConsulta)
    obtener: async (consulta: Record<string, string>) => {
        const { data } = await api.get<ApiResponse<TableroResponse>>('/tablero', { params: consulta })
        return data.datos
    },
}
