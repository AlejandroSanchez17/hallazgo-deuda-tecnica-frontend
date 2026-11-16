import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { env } from '../config/env'
import type { UsuarioActual, UsuarioSimulable } from '../types/usuario.types'

interface SesionState {
    usuarioSimuladoId: number | null
    usuario: UsuarioActual | null
    // Lista del selector de usuario simulado; null hasta la primera carga
    usuariosSimulables: UsuarioSimulable[] | null
    seleccionarUsuario: (id: number) => void
    guardarUsuario: (usuario: UsuarioActual) => void
    guardarUsuariosSimulables: (usuarios: UsuarioSimulable[]) => void
    cerrarSesion: () => void
}

export const useSesionStore = create<SesionState>()(
    persist(
        (set) => ({
            usuarioSimuladoId: env.usuarioSimuladoInicial,
            usuario: null,
            usuariosSimulables: null,
            seleccionarUsuario: (id) => set({ usuarioSimuladoId: id, usuario: null }),
            guardarUsuario: (usuario) => set({ usuario }),
            guardarUsuariosSimulables: (usuarios) => set({ usuariosSimulables: usuarios }),
            cerrarSesion: () => set({ usuarioSimuladoId: null, usuario: null }),
        }),
        {
            name: 'hdt-sesion',
            // Los permisos y la lista de simulables no se guardan: se piden de nuevo al recargar para no usar datos viejos
            partialize: (estado) => ({ usuarioSimuladoId: estado.usuarioSimuladoId }),
        },
    ),
)
