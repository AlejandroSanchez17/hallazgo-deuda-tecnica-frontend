import { useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../services/api'
import { obtenerUsuarioActual } from '../../services/api/auth'
import { useSesionStore } from '../../store/sesionStore'
import type { UsuarioActual } from '../../types/usuario.types'

interface ErrorDeUsuario {
    usuarioId: number
    error: ErrorApi
}

interface EstadoUsuarioActual {
    usuario: UsuarioActual | null
    cargando: boolean
    error: ErrorApi | null
}

// Se usa una sola vez, en el layout; las demas pantallas leen el usuario del store
export const useUsuarioActual = (): EstadoUsuarioActual => {
    const usuarioSimuladoId = useSesionStore((estado) => estado.usuarioSimuladoId)
    const usuario = useSesionStore((estado) => estado.usuario)
    const guardarUsuario = useSesionStore((estado) => estado.guardarUsuario)
    const [errorDeUsuario, setErrorDeUsuario] = useState<ErrorDeUsuario | null>(null)

    useEffect(() => {
        if (usuarioSimuladoId === null) {
            return
        }
        let vigente = true
        obtenerUsuarioActual()
            .then((usuarioObtenido) => {
                if (vigente) {
                    setErrorDeUsuario(null)
                    guardarUsuario(usuarioObtenido)
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setErrorDeUsuario({ usuarioId: usuarioSimuladoId, error: aErrorApi(error) })
                }
            })
        // Evita guardar la respuesta de un usuario que ya se cambio
        return () => {
            vigente = false
        }
    }, [usuarioSimuladoId, guardarUsuario])

    if (usuarioSimuladoId === null) {
        return { usuario: null, cargando: false, error: null }
    }
    if (usuario?.id === usuarioSimuladoId) {
        return { usuario, cargando: false, error: null }
    }
    if (errorDeUsuario?.usuarioId === usuarioSimuladoId) {
        return { usuario: null, cargando: false, error: errorDeUsuario.error }
    }
    return { usuario: null, cargando: true, error: null }
}
