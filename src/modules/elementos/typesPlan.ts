import type { EstadoElemento } from './types'

export type EstadoPlan = 'EN_ELABORACION' | 'EN_APROBACION' | 'APROBADO' | 'FINALIZADO'

export type EstadoTarea = 'PENDIENTE' | 'EN_PROGRESO' | 'BLOQUEADA' | 'FINALIZADA' | 'CANCELADA'

export type ResultadoAprobacion = 'PENDIENTE' | 'APROBADO' | 'DEVUELTO'

export type DecisionPlan = 'APROBADO' | 'DEVUELTO'

// Calculados por el backend solo en elaboracion; los bloqueantes impiden enviar a aprobacion
export interface ProblemaPlan {
    campo: string
    tareaId: number | null
    mensaje: string
    bloqueante: boolean
}

export interface AprobacionPlan {
    id: number
    resultado: ResultadoAprobacion
    rolRequeridoCodigo: string
    rolRequeridoNombre: string
    solicitanteId: number
    solicitanteNombre: string
    fechaSolicitud: string
    resolutorId: number | null
    resolutorNombre: string | null
    // Las observaciones si fue devuelto
    comentario: string | null
    fechaResolucion: string | null
}

export interface TareaResponse {
    id: number
    planId: number
    titulo: string
    descripcion: string | null
    responsableId: number
    responsableNombre: string
    // 'AAAA-MM-DD'
    fechaInicio: string
    fechaFin: string
    peso: number
    avance: number
    estado: EstadoTarea
    motivoEstado: string | null
    dependeDeId: number | null
    dependeDeTitulo: string | null
    // La tarea de la version anterior de la que se copio
    tareaOrigenId: number | null
    // Plan en elaboracion y tarea no finalizada ni cancelada
    editable: boolean
    // Abierta y con la fecha de fin ya pasada
    vencida: boolean
    // Fecha y hora ISO del ultimo avance registrado
    ultimoAvanceFecha: string | null
}

// Cancelada no se registra como avance: se usa la cancelacion
export type EstadoAvance = Exclude<EstadoTarea, 'CANCELADA'>

export interface AvanceRequest {
    porcentaje: number | null
    estado: EstadoAvance | null
    comentario: string
}

// GET /tareas/{id}/avances, el mas reciente primero
export interface AvanceResponse {
    id: number
    fecha: string
    porcentaje: number
    estadoResultante: EstadoTarea
    comentario: string
    usuarioId: number
    usuarioNombre: string
}

export interface AvanceFormulario {
    estado: string
    porcentaje: string
    comentario: string
}

// GET /tareas/mias: tareas abiertas del usuario en planes vigentes aprobados, por fecha de fin
export interface MiTarea {
    id: number
    titulo: string
    estado: EstadoTarea
    avance: number
    peso: number
    fechaInicio: string
    fechaFin: string
    vencida: boolean
    // Negativo si ya vencio
    diasRestantes: number
    planId: number
    elementoId: number
    elementoCodigo: string
    elementoTitulo: string
    ultimoAvanceFecha: string | null
}

// '' en cada filtro es "todos"; plazo: 'VENCIDAS' o 'EN_PLAZO'
export interface FiltrosMisTareas {
    estado: string
    plazo: string
}

// GET /elementos/{id}/plan (vigente) y GET /planes/{id} (cualquier version)
export interface PlanResponse {
    id: number
    elementoId: number
    elementoCodigo: string
    elementoEstado: EstadoElemento
    version: number
    vigente: boolean
    objetivo: string
    estrategia: string
    fechaInicio: string
    fechaCompromiso: string
    liderId: number
    liderNombre: string
    estado: EstadoPlan
    avance: number
    fechaCreacion: string
    // "Gerencia de TI" o "Registrador", segun la criticidad
    rolAprobadorNombre: string
    // Sin las tareas canceladas
    sumaPesos: number
    // RF-TAR-05: con true, una tarea no se finaliza sin al menos una evidencia vigente
    requiereEvidencia: boolean
    listoParaEnvio: boolean
    problemas: ProblemaPlan[]
    ultimaAprobacion: AprobacionPlan | null
    tareas: TareaResponse[]
}

// GET /elementos/{id}/planes, la version mas nueva primero
export interface PlanResumen {
    id: number
    version: number
    vigente: boolean
    estado: EstadoPlan
    fechaInicio: string
    fechaCompromiso: string
    liderId: number
    liderNombre: string
    avance: number
    fechaCreacion: string
}

// El lider no se envia: es siempre el del elemento
export interface PlanRequest {
    objetivo: string
    estrategia: string
    fechaInicio: string | null
    fechaCompromiso: string | null
    // Opcional en el backend: al crear queda en true si no se envia
    requiereEvidencia: boolean
}

export interface TareaRequest {
    titulo: string
    descripcion: string | null
    responsableId: number | null
    fechaInicio: string | null
    fechaFin: string | null
    peso: number | null
    dependeDeId: number | null
}

export interface PlanFormulario {
    objetivo: string
    estrategia: string
    fechaInicio: string
    fechaCompromiso: string
    requiereEvidencia: boolean
}

// Los combos y el peso se guardan como texto; '' es vacio
export interface TareaFormulario {
    titulo: string
    descripcion: string
    responsableId: string
    fechaInicio: string
    fechaFin: string
    peso: string
    dependeDeId: string
}
