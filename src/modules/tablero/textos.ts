import type { Opcion } from '../../utils/opciones'
import type { TipoElemento } from './types'

// Encabezados cortos: las tablas van de a dos
export const ENCABEZADO_TIPO: Record<TipoElemento, string> = {
    HALLAZGO: 'Hallazgos',
    DEUDA: 'Deuda',
}

// Atajos del periodo; "Personalizado" muestra las fechas Desde y Hasta
export const OPCIONES_PERIODO: Opcion[] = [
    { valor: 'anio', texto: 'Este año' },
    { valor: 'tresMeses', texto: 'Últimos 3 meses' },
    { valor: 'seisMeses', texto: 'Últimos 6 meses' },
    { valor: 'doceMeses', texto: 'Últimos 12 meses' },
    { valor: 'personalizado', texto: 'Personalizado' },
]

const formatoNumero = new Intl.NumberFormat('es', { maximumFractionDigits: 1 })

export const formatearNumero = (numero: number) => formatoNumero.format(numero)

// Sin base (denominador 0) el backend envia null: se muestra una raya
export const formatearPorcentaje = (valor: number | null) => (valor === null ? '—' : `${formatoNumero.format(valor)} %`)

export const formatearDias = (dias: number | null) =>
    dias === null ? '—' : `${formatoNumero.format(dias)} ${dias === 1 ? 'día' : 'días'}`

export const formatearHoras = (horas: number) => `${formatoNumero.format(horas)} h`

// "1 elemento", "3 elementos"
export const contar = (cantidad: number, singular: string, plural: string) =>
    `${cantidad} ${cantidad === 1 ? singular : plural}`

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// '2026-11' → 'nov 2026'; corto: 'nov'
export const textoMes = (mes: string, corto = false) => {
    const [anio, numero] = mes.split('-')
    const nombre = MESES[Number(numero) - 1]
    return corto ? nombre : `${nombre} ${anio}`
}

// Los calculos de la seccion 8.3 del requerimiento, tal como los hace el backend (BE-21)
export const CALCULO = {
    cumplimientoPlazo:
        'Cerrados en el período en o antes de su fecha compromiso original ÷ cerrados en el período. Una prórroga no cambia la fecha original.',
    vencidos: 'Elementos vencidos ÷ elementos abiertos, hoy.',
    tiempoPromedioCierre: 'Promedio de días entre la identificación y el cierre de los cerrados en el período.',
    tasaProrrogas:
        'Elementos con al menos una prórroga aprobada ÷ elementos con plan aprobado. Las prórrogas pedidas o rechazadas no cuentan.',
    tasaReapertura:
        'Cierres rechazados ÷ cierres resueltos (aprobados y rechazados) en el período. Las solicitudes pendientes no cuentan.',
    deudaPendiente: 'Suma del esfuerzo estimado de la deuda técnica que no está cerrada ni anulada.',
} as const
