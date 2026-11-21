import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MenuState {
    // Menu lateral reducido a solo iconos (escritorio); se recuerda al recargar
    colapsado: boolean
    cambiarColapsado: (colapsado: boolean) => void
}

export const useMenuStore = create<MenuState>()(
    persist(
        (set) => ({
            colapsado: false,
            cambiarColapsado: (colapsado) => set({ colapsado }),
        }),
        { name: 'hdt-menu' },
    ),
)
