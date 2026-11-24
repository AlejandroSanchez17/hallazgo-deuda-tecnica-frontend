import type { FiltrosBitacora } from './types'

export const SIN_FILTROS: FiltrosBitacora = {
    entidad: '',
    entidadId: '',
    usuario: '',
    accion: '',
    desde: '',
    hasta: '',
}

const CAMPOS = Object.keys(SIN_FILTROS) as (keyof FiltrosBitacora)[]

// Los filtros viven en la URL (/bitacora?entidad=elemento&entidadId=93): se puede enlazar a la historia de un registro
export const deUrl = (parametros: URLSearchParams): FiltrosBitacora =>
    Object.fromEntries(CAMPOS.map((campo) => [campo, parametros.get(campo) ?? ''])) as unknown as FiltrosBitacora

// Los vacios no se ponen en la URL
export const aUrl = (filtros: FiltrosBitacora): Record<string, string> =>
    Object.fromEntries(CAMPOS.filter((campo) => filtros[campo] !== '').map((campo) => [campo, filtros[campo]]))

export const hayFiltros = (filtros: FiltrosBitacora) => Object.values(filtros).some((valor) => valor !== '')

export const TAMANOS_PAGINA = [10, 50, 100]

export interface Paginacion {
    pagina: number
    tamano: number
}

// La pagina tambien vive en la URL: al volver del detalle de un cambio se regresa a ella. Un valor invalido se ignora
export const paginacionDeUrl = (parametros: URLSearchParams): Paginacion => {
    const pagina = Number(parametros.get('pagina'))
    const tamano = Number(parametros.get('tamano'))
    return {
        pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
        tamano: TAMANOS_PAGINA.includes(tamano) ? tamano : TAMANOS_PAGINA[0],
    }
}

// Los valores de siempre no se ponen en la URL
export const paginacionAUrl = ({ pagina, tamano }: Paginacion): Record<string, string> => ({
    ...(pagina > 1 && { pagina: String(pagina) }),
    ...(tamano !== TAMANOS_PAGINA[0] && { tamano: String(tamano) }),
})

// Lo que se manda al backend: el usuario se llama usuarioId, y un id que no sea un numero no se manda (daria 400)
export const aConsulta = (filtros: FiltrosBitacora): Record<string, string> => {
    const { usuario, entidadId, ...resto } = filtros
    const consulta: Record<string, string> = { ...resto, usuarioId: usuario, entidadId }
    if (!/^\d+$/.test(entidadId)) {
        delete consulta.entidadId
    }
    return Object.fromEntries(Object.entries(consulta).filter(([, valor]) => valor !== ''))
}

// 'AAAA-MM-DD' a fecha local, sin pasar por la zona horaria
export const deFechaApi = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-').map(Number)
    return new Date(anio, mes - 1, dia)
}
