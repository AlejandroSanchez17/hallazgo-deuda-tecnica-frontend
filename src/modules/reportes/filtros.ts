import { aFechaApi } from '../../utils/formato'
import type { Opcion } from '../../utils/opciones'
import { definicionDe } from './textos'
import type { CampoFiltro, DefinicionReporte, FiltrosReporte } from './types'

export const SIN_FILTROS: FiltrosReporte = {
    reporte: '',
    tipo: '',
    estado: '',
    criticidad: '',
    origen: '',
    area: '',
    equipo: '',
    lider: '',
    aplicacion: '',
    elemento: '',
    desde: '',
    hasta: '',
    mes: '',
}

const CAMPOS = Object.keys(SIN_FILTROS) as (keyof FiltrosReporte)[]

// Parametro del backend de cada filtro (GET /reportes/{codigo})
const PARAMETRO: Record<CampoFiltro, string> = {
    tipo: 'tipo',
    estado: 'estado',
    criticidad: 'criticidadId',
    origen: 'origenId',
    area: 'areaId',
    equipo: 'equipoId',
    lider: 'liderId',
    aplicacion: 'aplicacionId',
    elemento: 'elementoId',
}

// El reporte y sus filtros viven en la URL (/reportes?reporte=REP-03&equipo=6): el Excel respeta lo que se ve en
// pantalla, y los enlaces de la bandeja y de la ficha llegan con todo puesto. Un reporte que no existe se ignora
export const deUrl = (parametros: URLSearchParams): FiltrosReporte => {
    const filtros = Object.fromEntries(
        CAMPOS.map((campo) => [campo, parametros.get(campo) ?? '']),
    ) as unknown as FiltrosReporte
    return { ...filtros, reporte: definicionDe(filtros.reporte)?.codigo ?? '' }
}

export const aUrl = (filtros: FiltrosReporte): Record<string, string> =>
    Object.fromEntries(CAMPOS.filter((campo) => filtros[campo] !== '').map((campo) => [campo, filtros[campo]]))

// Al cambiar de reporte solo quedan los filtros que el nuevo usa
export const alElegirReporte = (filtros: FiltrosReporte, definicion: DefinicionReporte): FiltrosReporte => {
    const conservados = Object.fromEntries(definicion.filtros.map((campo) => [campo, filtros[campo]]))
    return {
        ...SIN_FILTROS,
        ...conservados,
        reporte: definicion.codigo,
        ...(definicion.periodo === 'fechas' ? { desde: filtros.desde, hasta: filtros.hasta } : {}),
        ...(definicion.periodo === 'mes' ? { mes: filtros.mes } : {}),
    }
}

// 'AAAA-MM' a su primer y ultimo dia
export const periodoDeMes = (mes: string) => {
    const [anio, numero] = mes.split('-').map(Number)
    return { desde: aFechaApi(new Date(anio, numero - 1, 1)), hasta: aFechaApi(new Date(anio, numero, 0)) }
}

// Parametros del backend: solo los filtros y el periodo que el reporte elegido usa
export const aConsulta = (filtros: FiltrosReporte): Record<string, string> => {
    const definicion = definicionDe(filtros.reporte)
    if (!definicion) {
        return {}
    }
    const consulta: Record<string, string> = Object.fromEntries(
        definicion.filtros.filter((campo) => filtros[campo] !== '').map((campo) => [PARAMETRO[campo], filtros[campo]]),
    )
    if (definicion.periodo === 'fechas') {
        if (filtros.desde !== '') {
            consulta.desde = filtros.desde
        }
        if (filtros.hasta !== '') {
            consulta.hasta = filtros.hasta
        }
    }
    // Sin mes el backend toma el mes anterior completo
    return definicion.periodo === 'mes' && filtros.mes !== '' ? { ...consulta, ...periodoDeMes(filtros.mes) } : consulta
}

const formatoMes = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' })

// Del mes anterior hacia atras: el informe mensual se saca de un mes ya terminado
export const opcionesDeMes = (hoy: Date, cantidad: number): Opcion[] =>
    Array.from({ length: cantidad }, (_, indice) => {
        const mes = new Date(hoy.getFullYear(), hoy.getMonth() - 1 - indice, 1)
        const numero = String(mes.getMonth() + 1).padStart(2, '0')
        return { valor: `${mes.getFullYear()}-${numero}`, texto: formatoMes.format(mes) }
    })

// 'AAAA-MM-DD' a fecha local, sin pasar por la zona horaria
export const deFechaApi = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-').map(Number)
    return new Date(anio, mes - 1, dia)
}
