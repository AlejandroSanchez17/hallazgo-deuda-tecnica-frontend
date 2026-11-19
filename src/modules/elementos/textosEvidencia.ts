import type { BadgeStatus } from '@hnba/react-ui'
import type { DestinoSubida, EstadoEvidencia, EvidenciaResponse, TipoEvidencia } from './typesEvidencia'

export const TIPO_EVIDENCIA: Record<TipoEvidencia, string> = {
    ARCHIVO: 'Archivo',
    ENLACE: 'Enlace',
}

export const ESTADO_EVIDENCIA: Record<EstadoEvidencia, { texto: string; estado: BadgeStatus }> = {
    VIGENTE: { texto: 'Vigente', estado: 'success' },
    REEMPLAZADA: { texto: 'Reemplazada', estado: 'neutral' },
}

const formatoTamano = new Intl.NumberFormat('es', { maximumFractionDigits: 1 })

// "820 KB", "1,2 MB"; los enlaces no tienen tamano
export const tamanoLegible = (bytes: number | null) => {
    if (bytes === null) {
        return '—'
    }
    if (bytes < 1024) {
        return `${bytes} B`
    }
    if (bytes < 1024 * 1024) {
        return `${formatoTamano.format(bytes / 1024)} KB`
    }
    return `${formatoTamano.format(bytes / (1024 * 1024))} MB`
}

// Clave del destino para los combos y el filtro: 'ELEMENTO', 'PLAN-3' o 'TAREA-15'
export const claveDestino = (destino: { destino: string; id: number | null }) =>
    destino.destino === 'ELEMENTO' ? 'ELEMENTO' : `${destino.destino}-${destino.id}`

export const destinoDeEvidencia = (evidencia: EvidenciaResponse): DestinoSubida => {
    if (evidencia.destino === 'TAREA') {
        return { destino: 'TAREA', id: evidencia.tareaId ?? 0, texto: `Tarea: ${evidencia.tareaTitulo ?? ''}` }
    }
    if (evidencia.destino === 'PLAN') {
        return { destino: 'PLAN', id: evidencia.planId ?? 0, texto: `Plan v${evidencia.planVersion ?? ''}` }
    }
    return { destino: 'ELEMENTO', id: evidencia.elementoId, texto: 'Elemento' }
}

// "Tarea: Análisis", "Plan v1" o "Elemento"
export const textoDestino = (evidencia: EvidenciaResponse) => destinoDeEvidencia(evidencia).texto

// Para el atributo accept del selector de archivo: ".pdf,.png,…"
export const aceptados = (extensiones: string[]) => extensiones.map((extension) => `.${extension}`).join(',')

export const ayudaArchivo = (extensiones: string[], maximoMb: number) =>
    `${extensiones.map((extension) => extension.toUpperCase()).join(', ')}; hasta ${maximoMb} MB.`
