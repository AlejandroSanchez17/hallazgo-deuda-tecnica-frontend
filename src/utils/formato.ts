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
