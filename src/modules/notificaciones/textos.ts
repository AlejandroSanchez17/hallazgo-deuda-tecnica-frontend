import type { IconName } from '@hnba/react-ui'
import type { TipoNotificacion } from './types'

interface DatosTipo {
    nombre: string
    icono: IconName
}

const TIPOS: Record<TipoNotificacion, DatosTipo> = {
    ASIGNACION: { nombre: 'Asignación', icono: 'user_check' },
    APROBACION_SOLICITADA: { nombre: 'Aprobación pendiente', icono: 'double_check' },
    APROBACION_RESUELTA: { nombre: 'Aprobación resuelta', icono: 'check_circle' },
    VENCIMIENTO_PROXIMO: { nombre: 'Vencimiento', icono: 'calendar_clock' },
    RESUMEN_SEMANAL: { nombre: 'Resumen semanal', icono: 'chart_pie' },
    REPORTE_LISTO: { nombre: 'Reporte listo', icono: 'bell' },
}

// Un tipo que el backend agregue despues se muestra con la campana y sin nombre propio
export const datosDeTipo = (tipo: string): DatosTipo =>
    TIPOS[tipo as TipoNotificacion] ?? { nombre: 'Notificación', icono: 'bell' }

export const textoSinLeer = (total: number) =>
    total === 0 ? 'Ninguna sin leer' : total === 1 ? '1 sin leer' : `${total} sin leer`
