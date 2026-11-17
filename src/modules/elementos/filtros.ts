import type { Opcion } from '../../utils/opciones'
import { coincide } from '../../utils/texto'
import type { ElementoResponse, FiltrosElementos } from './types'

export const SIN_FILTROS: FiltrosElementos = {
    tipo: '',
    estado: '',
    criticidad: '',
    equipo: '',
    origen: '',
    semaforo: '',
}

export const hayFiltros = (filtros: FiltrosElementos) => Object.values(filtros).some((valor) => valor !== '')

const cumple = (filtro: string, valor: string | number | null) => filtro === '' || filtro === String(valor)

// termino ya normalizado (sin acentos ni mayusculas)
export const filtrarElementos = (filas: ElementoResponse[], termino: string, filtros: FiltrosElementos) =>
    filas.filter(
        (elemento) =>
            cumple(filtros.tipo, elemento.tipo) &&
            cumple(filtros.estado, elemento.estado) &&
            cumple(filtros.criticidad, elemento.criticidadId) &&
            cumple(filtros.equipo, elemento.equipoId) &&
            cumple(filtros.origen, elemento.origenId) &&
            cumple(filtros.semaforo, elemento.semaforo) &&
            coincide(termino, elemento.codigo, elemento.titulo, elemento.equipoNombre, elemento.criticidadNombre),
    )

const unicas = (
    filas: ElementoResponse[],
    aOpcion: (elemento: ElementoResponse) => Opcion & { orden: number | string },
) => {
    const porValor = new Map(filas.map((elemento) => [aOpcion(elemento).valor, aOpcion(elemento)]))
    return [...porValor.values()]
        .sort((a, b) =>
            typeof a.orden === 'number' && typeof b.orden === 'number'
                ? a.orden - b.orden
                : String(a.orden).localeCompare(String(b.orden), 'es'),
        )
        .map(({ valor, texto }) => ({ valor, texto }))
}

// Las opciones salen de las filas que llegaron: con alcance PROPIO solo aparecen los equipos del usuario
export const opcionesDeFiltro = (filas: ElementoResponse[]) => ({
    criticidades: unicas(filas, (e) => ({
        valor: String(e.criticidadId),
        texto: e.criticidadNombre,
        orden: e.criticidadNivel,
    })),
    equipos: unicas(filas, (e) => ({ valor: String(e.equipoId), texto: e.equipoNombre, orden: e.equipoNombre })),
    origenes: unicas(filas, (e) => ({ valor: String(e.origenId), texto: e.origenNombre, orden: e.origenNombre })),
})
