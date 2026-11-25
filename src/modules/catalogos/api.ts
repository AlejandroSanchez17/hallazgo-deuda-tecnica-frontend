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
    RolResumen,
    TipoArea,
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

// Gerencias, areas y subareas son la misma tabla y la misma ruta; el filtro tipo separa las dos pantallas
const RUTA_AREAS = '/catalogos/areas'
const crudAreas = apiCatalogo<AreaResponse, AreaRequest>(RUTA_AREAS)

const listarAreas =
    (tipo?: TipoArea) =>
    async (activo?: boolean): Promise<AreaResponse[]> => {
        const { data } = await api.get<ApiResponse<AreaResponse[]>>(RUTA_AREAS, { params: { activo, tipo } })
        return data.datos
    }

// Areas y subareas (tipo AREA)
export const areasApi = { ...crudAreas, listar: listarAreas('AREA') }

export const gerenciasApi = { ...crudAreas, listar: listarAreas('GERENCIA') }

// Los tres niveles juntos, para saber de que tipo es el area que ya tiene un registro
export const areasYGerenciasApi = { listar: listarAreas() }

export const origenesApi = apiCatalogo<OrigenResponse, OrigenRequest>('/catalogos/origenes')

export const categoriasApi = apiCatalogo<CategoriaResponse, CategoriaRequest>('/catalogos/categorias-deuda')

export const aplicacionesApi = apiCatalogo<AplicacionResponse, AplicacionRequest>('/aplicaciones')

// Roles para los combos de criticidades (GET /roles?activo=true acepta CATALOGO:ACTUALIZAR)
export const rolesApi = {
    listar: async (activo?: boolean): Promise<RolResumen[]> => {
        const { data } = await api.get<ApiResponse<RolResumen[]>>('/roles', { params: { activo } })
        return data.datos
    },
}

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
