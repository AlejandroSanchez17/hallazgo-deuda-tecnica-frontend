import { useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../services/api'
import { obtenerUsuariosSimulables } from '../../services/api/auth'
import type { UsuarioSimulable } from '../../types/usuario.types'

interface EstadoUsuariosSimulables {
    usuarios: UsuarioSimulable[]
    cargando: boolean
    error: ErrorApi | null
}

export const useUsuariosSimulables = (): EstadoUsuariosSimulables => {
    const [usuarios, setUsuarios] = useState<UsuarioSimulable[] | null>(null)
    const [error, setError] = useState<ErrorApi | null>(null)

    useEffect(() => {
        let vigente = true
        obtenerUsuariosSimulables()
            .then((lista) => {
                if (vigente) {
                    setUsuarios(lista)
                }
            })
            .catch((errorObtenido: unknown) => {
                if (vigente) {
                    setError(aErrorApi(errorObtenido))
                }
            })
        return () => {
            vigente = false
        }
    }, [])

    return { usuarios: usuarios ?? [], cargando: usuarios === null && error === null, error }
}
