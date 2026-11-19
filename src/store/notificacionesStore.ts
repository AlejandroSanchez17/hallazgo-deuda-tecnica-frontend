import { create } from 'zustand'

interface NotificacionesState {
    // Notificaciones sin leer del usuario actual (la insignia de la campana)
    total: number
    // Cambia cada vez que algo pide volver a consultar el contador; useContadorNotificaciones lo escucha
    solicitud: number
    guardarTotal: (total: number) => void
    pedirRefresco: () => void
}

export const useNotificacionesStore = create<NotificacionesState>()((set) => ({
    total: 0,
    solicitud: 0,
    guardarTotal: (total) => set({ total }),
    pedirRefresco: () => set((estado) => ({ solicitud: estado.solicitud + 1 })),
}))
