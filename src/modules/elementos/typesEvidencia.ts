export type DestinoEvidencia = 'ELEMENTO' | 'PLAN' | 'TAREA'

export type TipoEvidencia = 'ARCHIVO' | 'ENLACE'

export type EstadoEvidencia = 'VIGENTE' | 'REEMPLAZADA'

// GET /elementos/{id}/evidencias: las del elemento, sus planes y sus tareas, la mas reciente primero
export interface EvidenciaResponse {
    id: number
    elementoId: number
    destino: DestinoEvidencia
    planId: number | null
    planVersion: number | null
    tareaId: number | null
    tareaTitulo: string | null
    tipo: TipoEvidencia
    nombre: string
    descripcion: string
    // Solo en los enlaces
    url: string | null
    tipoContenido: string | null
    tamanoBytes: number | null
    hashSha256: string | null
    estado: EstadoEvidencia
    reemplazaAId: number | null
    // Se calcula en la lista; en la respuesta de un POST llega siempre en null
    reemplazadaPorId: number | null
    usuarioId: number
    usuarioNombre: string
    // Fecha y hora ISO
    fecha: string
}

// Donde se sube: el elemento, el plan vigente o una de sus tareas
export interface DestinoSubida {
    destino: DestinoEvidencia
    // Id del elemento, del plan o de la tarea
    id: number
    texto: string
}

// Una evidencia nueva (en un destino) o el reemplazo de una vigente, que hereda su destino
export type ObjetivoSubida =
    { tipo: 'nueva'; destinos: DestinoSubida[] } | { tipo: 'reemplazo'; evidencia: EvidenciaResponse }

// Parametros tipos_archivo_permitidos y tamano_max_evidencia_mb
export interface LimitesEvidencia {
    extensiones: string[]
    maximoMb: number
}

export interface EvidenciaFormulario {
    tipo: TipoEvidencia
    // Clave del destino elegido ('TAREA-15'); '' sin elegir
    destino: string
    url: string
    nombre: string
    descripcion: string
}

// Lo que se envia: un archivo (multipart) o un enlace (JSON)
export type EnvioEvidencia =
    | { tipo: 'ARCHIVO'; archivo: File; descripcion: string }
    | { tipo: 'ENLACE'; url: string; nombre: string | null; descripcion: string }
