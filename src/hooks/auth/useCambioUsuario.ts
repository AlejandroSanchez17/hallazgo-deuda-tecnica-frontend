import { useNavigate } from 'react-router-dom'
import { useSesionStore } from '../../store/sesionStore'
import { RUTAS } from '../../utils/constants/rutas'
import type { UsuarioSimulable } from '../../types/usuario.types'
import { useUsuariosSimulables } from './useUsuariosSimulables'

interface CambioUsuario {
    usuarios: UsuarioSimulable[]
    cargando: boolean
    usuarioActual: UsuarioSimulable | undefined
    cambiarUsuario: (id: number) => void
}

// Temporal hasta el login (FE-02): define el usuario que se envia en X-Usuario-Id
export const useCambioUsuario = (): CambioUsuario => {
    const { usuarios, cargando } = useUsuariosSimulables()
    const usuarioSimuladoId = useSesionStore((estado) => estado.usuarioSimuladoId)
    const seleccionarUsuario = useSesionStore((estado) => estado.seleccionarUsuario)
    const navegar = useNavigate()

    const cambiarUsuario = (id: number) => {
        if (id === usuarioSimuladoId) {
            return
        }
        seleccionarUsuario(id)
        // El nuevo usuario puede no tener permiso para la pagina actual
        void navegar(RUTAS.inicio)
    }

    return {
        usuarios,
        cargando,
        usuarioActual: usuarios.find((usuario) => usuario.id === usuarioSimuladoId),
        cambiarUsuario,
    }
}
