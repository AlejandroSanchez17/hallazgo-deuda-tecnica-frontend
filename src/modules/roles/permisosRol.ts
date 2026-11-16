import type { Alcance } from '../../types/usuario.types'
import type { Permiso, PermisoAsignado, PermisoDeRol } from './types'

// Permisos marcados del rol: id del permiso -> alcance
export type MapaPermisos = Partial<Record<number, Alcance>>

export interface GrupoRecurso {
    recurso: string
    permisos: Permiso[]
}

const NOMBRES_RECURSO: Record<string, string> = {
    CATALOGO: 'Catálogo',
    PARAMETRO: 'Parámetro',
    BITACORA: 'Bitácora',
    PRORROGA: 'Prórroga',
    APROBACION: 'Aprobación',
    NOTIFICACION: 'Notificación',
}

const capitalizar = (texto: string) => `${texto.charAt(0).toUpperCase()}${texto.slice(1).toLowerCase()}`

export const nombreRecurso = (recurso: string) => NOMBRES_RECURSO[recurso] ?? capitalizar(recurso.replace(/_/g, ' '))

export const nombreAccion = (accion: string) => capitalizar(accion)

// Conserva el orden en que el backend entrega los permisos
export const agruparPorRecurso = (permisos: Permiso[]): GrupoRecurso[] => {
    const grupos = new Map<string, Permiso[]>()
    permisos.forEach((permiso) => grupos.set(permiso.recurso, [...(grupos.get(permiso.recurso) ?? []), permiso]))
    return [...grupos].map(([recurso, lista]) => ({ recurso, permisos: lista }))
}

const ORDEN_ACCIONES = ['LEER', 'CREAR', 'ACTUALIZAR', 'DESACTIVAR']

// Las columnas de la matriz: las acciones de todos los recursos, las comunes primero
export const accionesDe = (grupos: GrupoRecurso[]): string[] => {
    const acciones = [...new Set(grupos.flatMap((grupo) => grupo.permisos.map((permiso) => permiso.accion)))]
    const posicion = (accion: string) => {
        const indice = ORDEN_ACCIONES.indexOf(accion)
        return indice === -1 ? ORDEN_ACCIONES.length : indice
    }
    return acciones.sort((a, b) => posicion(a) - posicion(b))
}

// Estos recursos se leen en todo el sistema, aunque el rol trabaje solo con lo propio
const RECURSOS_SIEMPRE_TODO = ['CATALOGO', 'PARAMETRO']

export const asignadosDe = (grupo: GrupoRecurso, marcados: MapaPermisos) =>
    grupo.permisos.filter((permiso) => marcados[permiso.id] !== undefined)

// El alcance se decide por fila: es PROPIO si todos los permisos dados de la fila lo son; undefined si no hay ninguno
export const alcanceDeFila = (grupo: GrupoRecurso, marcados: MapaPermisos): Alcance | undefined => {
    const asignados = asignadosDe(grupo, marcados)
    if (asignados.length === 0) {
        return undefined
    }
    return asignados.every((permiso) => marcados[permiso.id] === 'PROPIO') ? 'PROPIO' : 'TODO'
}

// Solo estos roles trabajan con lo propio (su equipo o sus tareas); los demas siempre tienen alcance TODO
const ROLES_CON_SOLO_PROPIO = ['LIDER_TECNICO', 'MIEMBRO_EQUIPO']

export const admiteSoloPropio = (codigoRol: string) => ROLES_CON_SOLO_PROPIO.includes(codigoRol)

// Alcance del primer permiso de una fila
export const alcanceHabitual = (recurso: string, conSoloPropio: boolean): Alcance =>
    conSoloPropio && !RECURSOS_SIEMPRE_TODO.includes(recurso) ? 'PROPIO' : 'TODO'

export const aMapa = (permisos: PermisoDeRol[]): MapaPermisos =>
    Object.fromEntries(permisos.map((permiso) => [permiso.id, permiso.alcance]))

export const sinPermiso = (mapa: MapaPermisos, permisoId: number): MapaPermisos =>
    Object.fromEntries(Object.entries(mapa).filter(([id]) => Number(id) !== permisoId))

// Da o quita un permiso; uno nuevo toma el alcance de su fila, o el habitual si la fila estaba vacía
export const alternarPermiso = (
    marcados: MapaPermisos,
    grupo: GrupoRecurso,
    permisoId: number,
    habitual: Alcance,
): MapaPermisos => {
    if (marcados[permisoId] !== undefined) {
        return sinPermiso(marcados, permisoId)
    }
    return { ...marcados, [permisoId]: alcanceDeFila(grupo, marcados) ?? habitual }
}

// Aplica el mismo alcance a todos los permisos dados de la fila
export const asignarAlcanceDeFila = (marcados: MapaPermisos, grupo: GrupoRecurso, alcance: Alcance): MapaPermisos => ({
    ...marcados,
    ...Object.fromEntries(asignadosDe(grupo, marcados).map((permiso) => [permiso.id, alcance])),
})

// Cuenta los permisos agregados, quitados o con otro alcance
export const contarCambios = (original: MapaPermisos, actual: MapaPermisos) => {
    const ids = new Set([...Object.keys(original), ...Object.keys(actual)])
    return [...ids].filter((id) => original[Number(id)] !== actual[Number(id)]).length
}

// El PUT reemplaza la lista completa
export const aPermisosAsignados = (mapa: MapaPermisos): PermisoAsignado[] =>
    Object.entries(mapa).flatMap(([id, alcance]) => (alcance ? [{ permisoId: Number(id), alcance }] : []))
