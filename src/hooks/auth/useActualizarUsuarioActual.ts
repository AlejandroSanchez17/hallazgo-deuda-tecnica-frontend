import { useCallback } from 'react'
import { obtenerUsuarioActual } from '../../services/api/auth'
import { useSesionStore } from '../../store/sesionStore'

// Vuelve a pedir /usuarios/me para que el menu y los botones reflejen un cambio de permisos
export const useActualizarUsuarioActual = () => {
    const guardarUsuario = useSesionStore((estado) => estado.guardarUsuario)

    return useCallback(async () => {
        try {
            guardarUsuario(await obtenerUsuarioActual())
        } catch {
            // El interceptor de axios ya avisa el error
        }
    }, [guardarUsuario])
}
