import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type {
    AplicacionRequest,
    AplicacionResponse,
    AreaRequest,
    AreaResponse,
    CategoriaRequest,
    CategoriaResponse,
    CriticidadRequest,
    CriticidadResponse,
    OrigenRequest,
    OrigenResponse,
} from './types'

// Los catalogos con CRUD + estado comparten las mismas cuatro operaciones
const apiCatalogo = <R, S>(ruta: string) => ({
    listar: async (activo?: boolean): Promise<R[]> => {
        const { data } = await api.get<ApiResponse<R[]>>(ruta, { params: { activo } })
        return data.datos
    },
    crear: async (solicitud: S): Promise<R> => {
        const { data } = await api.post<ApiResponse<R>>(ruta, solicitud)
        return data.datos
    },
    actualizar: async (id: number, solicitud: S): Promise<R> => {
        const { data } = await api.put<ApiResponse<R>>(`${ruta}/${id}`, solicitud)
        return data.datos
    },
    cambiarEstado: async (id: number, activo: boolean): Promise<R> => {
        const { data } = await api.patch<ApiResponse<R>>(`${ruta}/${id}/estado`, { activo })
        return data.datos
    },
})

export const areasApi = apiCatalogo<AreaResponse, AreaRequest>('/catalogos/areas')

export const origenesApi = apiCatalogo<OrigenResponse, OrigenRequest>('/catalogos/origenes')

export const categoriasApi = apiCatalogo<CategoriaResponse, CategoriaRequest>('/catalogos/categorias-deuda')

export const aplicacionesApi = apiCatalogo<AplicacionResponse, AplicacionRequest>('/aplicaciones')

const RUTA_CRITICIDADES = '/catalogos/criticidades'

export const criticidadesApi = {
    listar: async (): Promise<CriticidadResponse[]> => {
        const { data } = await api.get<ApiResponse<CriticidadResponse[]>>(RUTA_CRITICIDADES)
        return data.datos
    },
    actualizar: async (id: number, solicitud: CriticidadRequest): Promise<CriticidadResponse> => {
        const { data } = await api.put<ApiResponse<CriticidadResponse>>(`${RUTA_CRITICIDADES}/${id}`, solicitud)
        return data.datos
    },
}
