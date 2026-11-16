import { useEffect, useState } from 'react'
import type { ErrorApi } from '../../services/api'
import { cargarUsuariosSimulables } from '../../services/api/auth'
import { useSesionStore } from '../../store/sesionStore'
import type { UsuarioSimulable } from '../../types/usuario.types'

interface EstadoUsuariosSimulables {
    usuarios: UsuarioSimulable[]
    cargando: boolean
    error: ErrorApi | null
}

// La lista vive en el store y se actualiza con recargarUsuariosSimulables; aqui solo se pide la primera vez
export const useUsuariosSimulables = (): EstadoUsuariosSimulables => {
    const usuarios = useSesionStore((estado) => estado.usuariosSimulables)
    const [error, setError] = useState<ErrorApi | null>(null)

    useEffect(() => {
        let vigente = true
        void cargarUsuariosSimulables().then((errorObtenido) => {
            if (vigente) {
                setError(errorObtenido)
            }
        })
        return () => {
            vigente = false
        }
    }, [])

    return { usuarios: usuarios ?? [], cargando: usuarios === null && error === null, error }
}
