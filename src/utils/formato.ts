const formatoFechaHora = new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})

// El backend envia fechas ISO en UTC; se muestran en la hora local del navegador
export const formatearFechaHora = (fechaIso: string | null | undefined) =>
    fechaIso ? formatoFechaHora.format(new Date(fechaIso)) : '—'

const MINUTO_MS = 60_000
const HORA_MS = 60 * MINUTO_MS
const DIA_MS = 24 * HORA_MS

// "hace 5 min", "hace 3 h", "ayer", "hace 4 días"; despues de una semana, la fecha y hora completas
export const formatearHace = (fechaIso: string) => {
    const transcurrido = Date.now() - new Date(fechaIso).getTime()
    if (transcurrido < MINUTO_MS) {
        return 'hace un momento'
    }
    if (transcurrido < HORA_MS) {
        return `hace ${Math.floor(transcurrido / MINUTO_MS)} min`
    }
    if (transcurrido < DIA_MS) {
        return `hace ${Math.floor(transcurrido / HORA_MS)} h`
    }
    const dias = Math.floor(transcurrido / DIA_MS)
    if (dias < 7) {
        return dias === 1 ? 'ayer' : `hace ${dias} días`
    }
    return formatearFechaHora(fechaIso)
}

// Fechas sin hora del backend ('AAAA-MM-DD'): se muestran tal cual, sin pasar por la zona horaria
export const formatearFecha = (fecha: string | null | undefined) => {
    if (!fecha) {
        return '—'
    }
    const [anio, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${anio}`
}

const dosDigitos = (numero: number) => String(numero).padStart(2, '0')

// Fecha local del navegador en el formato 'AAAA-MM-DD' que espera el backend
export const aFechaApi = (fecha: Date) =>
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`
