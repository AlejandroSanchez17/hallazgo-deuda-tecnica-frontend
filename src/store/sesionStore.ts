import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { env } from '../config/env'
import type { UsuarioActual } from '../types/usuario.types'

interface SesionState {
    usuarioSimuladoId: number | null
    usuario: UsuarioActual | null
    seleccionarUsuario: (id: number) => void
    guardarUsuario: (usuario: UsuarioActual) => void
    cerrarSesion: () => void
}

export const useSesionStore = create<SesionState>()(
    persist(
        (set) => ({
            usuarioSimuladoId: env.usuarioSimuladoInicial,
            usuario: null,
            seleccionarUsuario: (id) => set({ usuarioSimuladoId: id, usuario: null }),
            guardarUsuario: (usuario) => set({ usuario }),
            cerrarSesion: () => set({ usuarioSimuladoId: null, usuario: null }),
        }),
        {
            name: 'hdt-sesion',
            // Los permisos no se guardan: se piden de nuevo al recargar para no usar datos viejos
            partialize: (estado) => ({ usuarioSimuladoId: estado.usuarioSimuladoId }),
        },
    ),
)
