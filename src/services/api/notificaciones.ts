import type { ApiResponse } from '../../types/api.types'
import { api } from './index'

// Contador de la campana; es comun porque lo usan el Header y el interceptor, no solo el modulo de notificaciones
export const consultarNoLeidas = async (): Promise<number> => {
    const { data } = await api.get<ApiResponse<{ total: number }>>('/notificaciones/no-leidas/total', {
        silencioso: true,
    })
    return data.datos.total
}
