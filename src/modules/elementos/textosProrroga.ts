import type { BadgeStatus } from '@hnba/react-ui'
import type { EstadoProrroga, ResultadoCierre, TipoPendiente } from './typesProrroga'

export const ESTADO_PRORROGA: Record<EstadoProrroga, { texto: string; estado: BadgeStatus }> = {
    PENDIENTE: { texto: 'Pendiente', estado: 'warning' },
    APROBADA: { texto: 'Aprobada', estado: 'success' },
    RECHAZADA: { texto: 'Rechazada', estado: 'error' },
}

export const RESULTADO_CIERRE: Record<ResultadoCierre, { texto: string; estado: BadgeStatus }> = {
    PENDIENTE: { texto: 'Pendiente', estado: 'warning' },
    APROBADO: { texto: 'Aprobado', estado: 'success' },
    RECHAZADO: { texto: 'Rechazado', estado: 'error' },
}

export const TIPO_PENDIENTE: Record<TipoPendiente, { texto: string; estado: BadgeStatus }> = {
    PLAN: { texto: 'Plan', estado: 'info' },
    PRORROGA: { texto: 'Prórroga', estado: 'warning' },
    CIERRE: { texto: 'Cierre', estado: 'success' },
}

// RN-08
export const AVISO_ADICIONAL =
    'Supera el máximo de su criticidad: es una prórroga adicional y la resuelve Gerencia de TI.'

// "1 de 2 prórrogas"
export const textoCantidad = (aprobadas: number, maximo?: number) =>
    maximo === undefined
        ? `${aprobadas} ${aprobadas === 1 ? 'aprobada' : 'aprobadas'}`
        : `${aprobadas} de ${maximo} ${maximo === 1 ? 'prórroga' : 'prórrogas'}`

export const textoEspera = (dias: number) => (dias === 0 ? 'Hoy' : dias === 1 ? '1 día' : `${dias} días`)
