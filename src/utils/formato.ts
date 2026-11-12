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
