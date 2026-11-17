import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type {
    CategoriaDisponible,
    CriticidadDisponible,
    ElementoActualizarRequest,
    ElementoCrearRequest,
    ElementoDetalleResponse,
    ElementoResponse,
    EquipoDisponible,
    HorasPorTalla,
    ParametroTalla,
    RegistroDeCatalogo,
} from './types'
import { TALLAS } from './textos'

const RUTA_ELEMENTOS = '/elementos'

export const elementosApi = {
    // Con alcance PROPIO ya llega solo lo del equipo del usuario
    listar: async (): Promise<ElementoResponse[]> => {
        const { data } = await api.get<ApiResponse<ElementoResponse[]>>(RUTA_ELEMENTOS)
        return data.datos
    },
    obtener: async (id: number): Promise<ElementoDetalleResponse> => {
        const { data } = await api.get<ApiResponse<ElementoDetalleResponse>>(`${RUTA_ELEMENTOS}/${id}`)
        return data.datos
    },
    // Devuelven el mensaje del backend, que trae el codigo ("Hallazgo HA-2026-0009 registrado")
    crear: async (solicitud: ElementoCrearRequest): Promise<string> => {
        const { data } = await api.post<ApiResponse<ElementoDetalleResponse>>(RUTA_ELEMENTOS, solicitud)
        return data.mensaje
    },
    actualizar: async (id: number, solicitud: ElementoActualizarRequest): Promise<string> => {
        const { data } = await api.put<ApiResponse<ElementoDetalleResponse>>(`${RUTA_ELEMENTOS}/${id}`, solicitud)
        return data.mensaje
    },
}

const listarActivos =
    <T>(ruta: string) =>
    async (): Promise<T[]> => {
        const { data } = await api.get<ApiResponse<T[]>>(ruta, { params: { activo: true } })
        return data.datos
    }

// Solo para los combos del formulario; los catalogos y los equipos se administran en sus modulos
export const combosApi = {
    origenes: listarActivos<RegistroDeCatalogo>('/catalogos/origenes'),
    categorias: listarActivos<CategoriaDisponible>('/catalogos/categorias-deuda'),
    aplicaciones: listarActivos<RegistroDeCatalogo>('/aplicaciones'),
    equipos: listarActivos<EquipoDisponible>('/equipos'),
    // Las criticidades no admiten el filtro de activo: se filtran en el navegador
    criticidades: async (): Promise<CriticidadDisponible[]> => {
        const { data } = await api.get<ApiResponse<CriticidadDisponible[]>>('/catalogos/criticidades')
        return data.datos.filter((criticidad) => criticidad.activo)
    },
    // Horas equivalentes de cada talla (parametros talla_xs_horas … talla_xl_horas), las mismas que usa la vista
    // v_deuda_esfuerzo_horas de la base
    horasPorTalla: async (): Promise<HorasPorTalla> => {
        const { data } = await api.get<ApiResponse<ParametroTalla[]>>('/parametros')
        return Object.fromEntries(
            TALLAS.map((talla) => [
                talla,
                Number(data.datos.find((parametro) => parametro.clave === `talla_${talla.toLowerCase()}_horas`)?.valor),
            ]).filter(([, horas]) => !Number.isNaN(horas)),
        ) as HorasPorTalla
    },
}
