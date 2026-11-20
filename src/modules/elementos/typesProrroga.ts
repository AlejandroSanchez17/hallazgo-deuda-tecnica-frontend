import type { EstadoElemento, TipoElemento } from './types'

export type EstadoProrroga = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'

export type DecisionProrroga = 'APROBADA' | 'RECHAZADA'

export type ResultadoCierre = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

export type DecisionCierre = 'APROBADO' | 'RECHAZADO'

// Las fechas sin hora como 'AAAA-MM-DD'; las de solicitud y resolucion, ISO con hora
export interface ProrrogaResponse {
    id: number
    elementoId: number
    fechaAnterior: string
    fechaPropuesta: string
    justificacion: string
    // Pedida despues de usar las que permite la criticidad (RN-08)
    esAdicional: boolean
    estado: EstadoProrroga
    solicitanteId: number
    solicitanteNombre: string
    fechaSolicitud: string
    resolutorId: number | null
    resolutorNombre: string | null
    comentarioResolucion: string | null
    fechaResolucion: string | null
}

// GET /elementos/{id}/prorrogas: el resumen de HU-06 y el historial, la mas reciente primero
export interface ProrrogasDelElemento {
    fechaCompromisoOriginal: string
    fechaCompromisoVigente: string
    aprobadas: number
    maximo: number
    siguienteEsAdicional: boolean
    hayPendiente: boolean
    prorrogas: ProrrogaResponse[]
}

export interface ProrrogaRequest {
    fechaPropuesta: string
    justificacion: string
}

// GET /elementos/{id}/cierres, la mas reciente primero
export interface CierreResponse {
    id: number
    elementoId: number
    planId: number | null
    planVersion: number | null
    resultado: ResultadoCierre
    rolRequeridoNombre: string
    solicitanteId: number
    solicitanteNombre: string
    fechaSolicitud: string
    resolutorId: number | null
    resolutorNombre: string | null
    comentario: string | null
    fechaResolucion: string | null
}

export type TipoPendiente = 'PLAN' | 'PRORROGA' | 'CIERRE'

// GET /aprobaciones/pendientes, de la mas antigua a la mas nueva. Los datos de la prorroga llegan en null en planes
// y cierres; planId y planVersion, en null en las prorrogas
export interface PendienteResponse {
    tipo: TipoPendiente
    // De la aprobacion o de la prorroga
    id: number
    elementoId: number
    elementoCodigo: string
    elementoTipo: TipoElemento
    elementoTitulo: string
    elementoEstado: EstadoElemento
    criticidadNombre: string
    criticidadNivel: number
    equipoId: number
    equipoNombre: string
    liderId: number | null
    liderNombre: string | null
    fechaCompromisoVigente: string
    solicitanteId: number
    solicitanteNombre: string
    fechaSolicitud: string
    diasEsperando: number
    rolRequeridoNombre: string | null
    planId: number | null
    planVersion: number | null
    fechaAnterior: string | null
    fechaPropuesta: string | null
    esAdicional: boolean | null
    justificacion: string | null
}

// '' en cada filtro es "todos"
export interface FiltrosAprobaciones {
    tipo: string
    criticidad: string
    equipo: string
}
