import type { Opcion } from '../../utils/opciones'
import { coincide } from '../../utils/texto'
import { ESTADO_TAREA } from './textosPlan'
import type { FiltrosMisTareas, MiTarea } from './typesPlan'

export const SIN_FILTROS_TAREAS: FiltrosMisTareas = { estado: '', plazo: '' }

export const hayFiltrosTareas = (filtros: FiltrosMisTareas) => filtros.estado !== '' || filtros.plazo !== ''

// Mis tareas solo trae tareas abiertas
export const OPCIONES_ESTADO_ABIERTA: Opcion[] = (['PENDIENTE', 'EN_PROGRESO', 'BLOQUEADA'] as const).map((estado) => ({
    valor: estado,
    texto: ESTADO_TAREA[estado].texto,
}))

export const OPCIONES_PLAZO: Opcion[] = [
    { valor: 'VENCIDAS', texto: 'Vencidas' },
    { valor: 'EN_PLAZO', texto: 'En plazo' },
]

// termino ya normalizado (sin acentos ni mayusculas)
export const filtrarMisTareas = (filas: MiTarea[], termino: string, filtros: FiltrosMisTareas) =>
    filas.filter(
        (tarea) =>
            (filtros.estado === '' || tarea.estado === filtros.estado) &&
            (filtros.plazo === '' || (filtros.plazo === 'VENCIDAS') === tarea.vencida) &&
            coincide(termino, tarea.titulo, tarea.elementoCodigo, tarea.elementoTitulo),
    )
