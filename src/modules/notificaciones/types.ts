export type TipoNotificacion =
    | 'ASIGNACION'
    | 'APROBACION_SOLICITADA'
    | 'APROBACION_RESUELTA'
    | 'VENCIMIENTO_PROXIMO'
    | 'RESUMEN_SEMANAL'
    | 'REPORTE_LISTO'

export type DestinoNotificacion = 'ELEMENTO' | 'PLAN' | 'TAREA' | 'PRORROGA' | 'CIERRE'

export interface NotificacionResponse {
    id: number
    tipo: TipoNotificacion
    mensaje: string
    // Los tres llegan en null en el resumen semanal, que no es de un elemento
    elementoId: number | null
    elementoCodigo: string | null
    elementoTipo: 'HALLAZGO' | 'DEUDA' | null
    // A donde lleva al abrirla (script 08); null sin elemento. tareaId llega solo y siempre con TAREA
    destino: DestinoNotificacion | null
    tareaId: number | null
    leida: boolean
    fechaLectura: string | null
    fecha: string
}

export interface PaginaNotificaciones {
    contenido: NotificacionResponse[]
    // Desde 0, como la envia el backend
    pagina: number
    tamano: number
    totalElementos: number
    totalPaginas: number
}

export interface ConsultaNotificaciones {
    soloNoLeidas: boolean
    pagina: number
    tamano: number
}
