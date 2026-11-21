import { rutaElementosFiltrados } from '../../utils/constants/rutas'
import { aFechaApi } from '../../utils/formato'
import type { FiltrosTablero, OpcionPeriodo } from './types'

// Sin parametros en la URL: el backend usa del 1 de enero a hoy
export const PERIODO_POR_DEFECTO: FiltrosTablero = { periodo: 'anio', desde: '', hasta: '' }

const MESES_ATRAS: Partial<Record<OpcionPeriodo, number>> = { tresMeses: 3, seisMeses: 6, doceMeses: 12 }

const esPeriodo = (valor: string | null): valor is OpcionPeriodo =>
    valor === 'anio' || valor === 'personalizado' || (valor !== null && valor in MESES_ATRAS)

// El periodo vive en la URL (/tablero?periodo=seisMeses, o personalizado con desde y hasta): sobrevive a Atras y Recargar
export const deUrl = (parametros: URLSearchParams): FiltrosTablero => {
    const periodo = parametros.get('periodo')
    if (!esPeriodo(periodo)) {
        return PERIODO_POR_DEFECTO
    }
    return periodo === 'personalizado'
        ? { periodo, desde: parametros.get('desde') ?? '', hasta: parametros.get('hasta') ?? '' }
        : { periodo, desde: '', hasta: '' }
}

export const aUrl = ({ periodo, desde, hasta }: FiltrosTablero): Record<string, string> => {
    if (periodo === 'anio') {
        return {}
    }
    if (periodo !== 'personalizado') {
        return { periodo }
    }
    return Object.fromEntries(Object.entries({ periodo, desde, hasta }).filter(([, valor]) => valor !== ''))
}

// El mismo dia N meses atras; si ese mes es mas corto, su ultimo dia (31/05 menos 3 meses → 28/02)
const mesesAtras = (hoy: Date, meses: number) => {
    const primero = new Date(hoy.getFullYear(), hoy.getMonth() - meses, 1)
    const ultimoDia = new Date(primero.getFullYear(), primero.getMonth() + 1, 0).getDate()
    return new Date(primero.getFullYear(), primero.getMonth(), Math.min(hoy.getDate(), ultimoDia))
}

// Parametros de GET /tablero: los atajos se convierten en fechas; "Este año" no manda nada
export const aConsulta = (filtros: FiltrosTablero, hoy: Date): Record<string, string> => {
    const meses = MESES_ATRAS[filtros.periodo]
    if (meses !== undefined) {
        return { desde: aFechaApi(mesesAtras(hoy, meses)), hasta: aFechaApi(hoy) }
    }
    if (filtros.periodo === 'personalizado') {
        return Object.fromEntries(
            Object.entries({ desde: filtros.desde, hasta: filtros.hasta }).filter(([, valor]) => valor !== ''),
        )
    }
    return {}
}

// El semaforo es la foto de hoy: el periodo no lo cambia, asi que el listado muestra lo mismo que el tablero
export const enlaceListado = (semaforo: string, equipoId?: number) =>
    rutaElementosFiltrados({ semaforo, equipo: equipoId === undefined ? '' : String(equipoId) })

// 'AAAA-MM-DD' a fecha local, sin pasar por la zona horaria
export const deFechaApi = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-').map(Number)
    return new Date(anio, mes - 1, dia)
}
