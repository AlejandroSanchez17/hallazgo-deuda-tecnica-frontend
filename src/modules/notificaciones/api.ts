import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { ConsultaNotificaciones, NotificacionResponse, PaginaNotificaciones } from './types'

export const notificacionesApi = {
    listar: async (consulta: ConsultaNotificaciones) => {
        const { data } = await api.get<ApiResponse<PaginaNotificaciones>>('/notificaciones', { params: consulta })
        return data.datos
    },
    marcarLeida: async (id: number) => {
        const { data } = await api.post<ApiResponse<NotificacionResponse>>(`/notificaciones/${id}/lectura`)
        return data.datos
    },
    marcarTodas: async () => {
        const { data } = await api.post<ApiResponse<{ marcadas: number }>>('/notificaciones/lectura')
        return data.mensaje
    },
}
