import type { BadgeStatus } from '@hnba/react-ui'
import type { EstadoPlan, EstadoTarea, PlanResponse, TareaResponse } from './typesPlan'

export const ESTADO_PLAN: Record<EstadoPlan, { texto: string; estado: BadgeStatus }> = {
    EN_ELABORACION: { texto: 'En elaboración', estado: 'info' },
    EN_APROBACION: { texto: 'En aprobación', estado: 'warning' },
    APROBADO: { texto: 'Aprobado', estado: 'success' },
    FINALIZADO: { texto: 'Finalizado', estado: 'neutral' },
}

export const ESTADO_TAREA: Record<EstadoTarea, { texto: string; estado: BadgeStatus }> = {
    PENDIENTE: { texto: 'Pendiente', estado: 'info' },
    EN_PROGRESO: { texto: 'En progreso', estado: 'warning' },
    BLOQUEADA: { texto: 'Bloqueada', estado: 'error' },
    FINALIZADA: { texto: 'Finalizada', estado: 'success' },
    CANCELADA: { texto: 'Cancelada', estado: 'neutral' },
}

const formatoNumero = new Intl.NumberFormat('es', { maximumFractionDigits: 2 })

export const textoNumero = (valor: number) => formatoNumero.format(valor)

export const textoPorcentaje = (valor: number) => `${formatoNumero.format(valor)} %`

// Acepta coma o punto decimal; un texto que no es numero da NaN
export const aDecimal = (valor: string) => (valor.trim() === '' ? null : Number(valor.trim().replace(',', '.')))

const abierta = (tarea: TareaResponse) => tarea.estado !== 'FINALIZADA' && tarea.estado !== 'CANCELADA'

// En elaboracion la cancelada solo deja de contar; con el plan aprobado su peso se reparte entre las abiertas (si no
// hay, entre las finalizadas) para que la suma siga en 100
export const avisoCancelacion = (plan: PlanResponse, tarea: TareaResponse) => {
    const inicio = `"${tarea.titulo}" queda cancelada`
    if (plan.estado !== 'APROBADO') {
        return `${inicio} y deja de contar en la suma de pesos. No se puede reactivar.`
    }
    const otras = plan.tareas.filter((otra) => otra.id !== tarea.id && otra.estado !== 'CANCELADA')
    const abiertas = otras.filter(abierta)
    const reciben = abiertas.length > 0 ? abiertas : otras
    const quienes =
        reciben.length === 1
            ? `pasa a "${reciben[0].titulo}"`
            : `se reparte en proporción entre las ${reciben.length} tareas ${abiertas.length > 0 ? 'abiertas' : 'finalizadas'}`
    return `${inicio}. Su peso (${textoNumero(tarea.peso)}) ${quienes}, para que la suma siga en 100. No se puede reactivar.`
}

// Una tarea que depende de otra no pasa de Pendiente hasta que esa otra este finalizada (422 del backend)
export const avisoDependencia = (plan: PlanResponse, tarea: TareaResponse) => {
    const previa = plan.tareas.find((otra) => otra.id === tarea.dependeDeId)
    return previa && previa.estado !== 'FINALIZADA'
        ? `Depende de "${previa.titulo}", que no está finalizada: por ahora solo puede quedar Pendiente.`
        : undefined
}
