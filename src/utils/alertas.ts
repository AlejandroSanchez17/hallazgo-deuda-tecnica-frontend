import type { ToastItem } from '@hnba/react-ui'

// Los avisos salen del ToastProvider de la libreria. El interceptor de axios no es un componente
// y no puede usar el hook useToast, asi que PuenteAvisos registra aqui la funcion de aviso.
type MostrarAviso = (aviso: Omit<ToastItem, 'id'>) => unknown

let mostrarAviso: MostrarAviso | null = null

export const registrarAvisos = (funcion: MostrarAviso | null) => {
    mostrarAviso = funcion
}

export const avisarExito = (mensaje: string) => mostrarAviso?.({ variant: 'success', title: mensaje, durationMs: 3000 })

export const avisarInfo = (mensaje: string) => mostrarAviso?.({ variant: 'info', title: mensaje, durationMs: 6000 })

export const avisarError = (mensaje: string) =>
    mostrarAviso?.({ variant: 'error', layout: 'card', title: mensaje, durationMs: 8000 })
