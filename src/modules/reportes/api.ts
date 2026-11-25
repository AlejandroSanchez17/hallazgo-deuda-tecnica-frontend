import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import { nombreDeDescarga } from '../../utils/descarga'
import { aFechaApi } from '../../utils/formato'
import type { AreaCombo, CodigoReporte, ElementoCombo, EquipoCombo, FormatoReporte, RegistroCombo } from './types'

// Generar el archivo puede tardar mas que el limite general de 15 s
const TIEMPO_REPORTE = 5 * 60 * 1000

export interface Descarga {
    contenido: Blob
    nombre: string
}

export const reportesApi = {
    // El 200 es el archivo, no JSON. Los errores llegan como JSON dentro de un blob: el interceptor de services/api
    // los lee, asi que aqui salen como ErrorApi con el mensaje y los campos del backend
    generar: async (
        codigo: CodigoReporte,
        formato: FormatoReporte,
        consulta: Record<string, string>,
    ): Promise<Descarga> => {
        const respuesta = await api.get<Blob>(`/reportes/${codigo}`, {
            params: { ...consulta, formato },
            responseType: 'blob',
            timeout: TIEMPO_REPORTE,
        })
        const encabezado = respuesta.headers['content-disposition'] as string | undefined
        // Si el backend no expone Content-Disposition por CORS, el nombre es como el suyo: REP-03_2026-11-21.xlsx
        const respaldo = `${codigo}_${aFechaApi(new Date())}.${formato}`
        return { contenido: respuesta.data, nombre: nombreDeDescarga(encabezado, respaldo) }
    },
}

const listar =
    <T>(ruta: string, params?: Record<string, boolean>) =>
    async (): Promise<T[]> => {
        const { data } = await api.get<ApiResponse<T[]>>(ruta, { params })
        return data.datos
    }

// Solo para los combos de filtros; los catalogos y los equipos se administran en sus modulos. Con alcance PROPIO
// /equipos y /elementos ya traen solo lo del usuario
export const combosApi = {
    // Las criticidades no admiten el filtro de activo: se filtran en el navegador
    criticidades: async (): Promise<RegistroCombo[]> =>
        (await listar<RegistroCombo>('/catalogos/criticidades')()).filter((criticidad) => criticidad.activo !== false),
    origenes: listar<RegistroCombo>('/catalogos/origenes', { activo: true }),
    // Los tres niveles: el reporte por una gerencia o un area incluye lo que depende de ella
    areas: listar<AreaCombo>('/catalogos/areas', { activo: true }),
    aplicaciones: listar<RegistroCombo>('/aplicaciones', { activo: true }),
    // Todos los equipos, activos o no: un reporte puede ser de un equipo que ya se desactivo
    equipos: listar<EquipoCombo>('/equipos'),
    elementos: listar<ElementoCombo>('/elementos'),
}
