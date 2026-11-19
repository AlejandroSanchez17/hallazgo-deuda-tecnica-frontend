import type { Opcion } from '../../utils/opciones'
import { coincide } from '../../utils/texto'
import { TIPO_PENDIENTE } from './textosProrroga'
import type { FiltrosAprobaciones, PendienteResponse } from './typesProrroga'

export const SIN_FILTROS_APROBACIONES: FiltrosAprobaciones = { tipo: '', criticidad: '', equipo: '' }

export const hayFiltrosAprobaciones = (filtros: FiltrosAprobaciones) =>
    Object.values(filtros).some((valor) => valor !== '')

export const OPCIONES_TIPO_PENDIENTE: Opcion[] = Object.entries(TIPO_PENDIENTE).map(([valor, { texto }]) => ({
    valor,
    texto,
}))

const cumple = (filtro: string, valor: string | number) => filtro === '' || filtro === String(valor)

// termino ya normalizado (sin acentos ni mayusculas)
export const filtrarAprobaciones = (filas: PendienteResponse[], termino: string, filtros: FiltrosAprobaciones) =>
    filas.filter(
        (fila) =>
            cumple(filtros.tipo, fila.tipo) &&
            cumple(filtros.criticidad, fila.criticidadNivel) &&
            cumple(filtros.equipo, fila.equipoId) &&
            coincide(termino, fila.elementoCodigo, fila.elementoTitulo, fila.solicitanteNombre, fila.equipoNombre),
    )

const unicas = (pares: [string, string, number | string][]) =>
    [...new Map(pares.map(([valor, texto, orden]) => [valor, { valor, texto, orden }])).values()]
        .sort((a, b) =>
            typeof a.orden === 'number' && typeof b.orden === 'number'
                ? a.orden - b.orden
                : String(a.orden).localeCompare(String(b.orden), 'es'),
        )
        .map(({ valor, texto }) => ({ valor, texto }))

// Las opciones salen de las filas que llegaron
export const opcionesDeAprobaciones = (filas: PendienteResponse[]) => ({
    criticidades: unicas(filas.map((f) => [String(f.criticidadNivel), f.criticidadNombre, f.criticidadNivel])),
    equipos: unicas(filas.map((f) => [String(f.equipoId), f.equipoNombre, f.equipoNombre])),
})
