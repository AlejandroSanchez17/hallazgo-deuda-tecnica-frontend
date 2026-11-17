import type { BadgeStatus } from '@hnba/react-ui'
import type { Opcion } from '../../utils/opciones'
import type { EstadoElemento, Semaforo, Talla, TipoElemento } from './types'

export const TEXTO_TIPO: Record<TipoElemento, string> = {
    HALLAZGO: 'Hallazgo',
    DEUDA: 'Deuda técnica',
}

// En el orden del ciclo de vida; ANULADO va aparte
export const TEXTO_ESTADO: Record<EstadoElemento, string> = {
    REGISTRADO: 'Registrado',
    PLAN_EN_ELABORACION: 'Plan en elaboración',
    PLAN_EN_APROBACION: 'Plan en aprobación',
    EN_EJECUCION: 'En ejecución',
    CIERRE_SOLICITADO: 'Cierre solicitado',
    CERRADO: 'Cerrado',
    ANULADO: 'Anulado',
}

export const SEMAFORO: Record<Semaforo, { texto: string; estado: BadgeStatus }> = {
    VENCIDO: { texto: 'Vencido', estado: 'error' },
    EN_RIESGO: { texto: 'En riesgo', estado: 'warning' },
    EN_TIEMPO: { texto: 'En tiempo', estado: 'success' },
}

export const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL']

const aOpciones = (textos: Record<string, string>): Opcion[] =>
    Object.entries(textos).map(([valor, texto]) => ({ valor, texto }))

export const OPCIONES_TIPO = aOpciones(TEXTO_TIPO)
export const OPCIONES_ESTADO = aOpciones(TEXTO_ESTADO)
export const OPCIONES_SEMAFORO: Opcion[] = Object.entries(SEMAFORO).map(([valor, { texto }]) => ({ valor, texto }))

const formatoHoras = new Intl.NumberFormat('es', { maximumFractionDigits: 2 })

// "XS · 4 horas"; sin la equivalencia (no se pudo leer el parametro) queda solo la talla
export const textoTalla = (talla: Talla, horas?: number) =>
    horas === undefined ? talla : `${talla} · ${formatoHoras.format(horas)} ${horas === 1 ? 'hora' : 'horas'}`

export const textoDias = (dias: number | null) => {
    if (dias === null) {
        return ''
    }
    if (dias < 0) {
        return dias === -1 ? 'Venció hace 1 día' : `Venció hace ${-dias} días`
    }
    if (dias === 0) {
        return 'Vence hoy'
    }
    return dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`
}
