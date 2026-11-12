import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuariosSimulables } from '../../../hooks/auth/useUsuariosSimulables'
import { useSesionStore } from '../../../store/sesionStore'
import { RUTAS } from '../../../utils/constants/rutas'
import { Selector } from '../../ui/Selector/Selector'

// Temporal hasta el login (FE-02): elige el usuario que se envia en X-Usuario-Id
export const SelectorUsuario = () => {
    const { usuarios, cargando } = useUsuariosSimulables()
    const usuarioSimuladoId = useSesionStore((estado) => estado.usuarioSimuladoId)
    const seleccionarUsuario = useSesionStore((estado) => estado.seleccionarUsuario)
    const navegar = useNavigate()

    const opciones = usuarios.map((usuario) => ({
        valor: usuario.id,
        texto: `${usuario.nombre} · ${usuario.roles.map((rol) => rol.nombre).join(', ')}`,
    }))

    const cambiarUsuario = (evento: ChangeEvent<HTMLSelectElement>) => {
        if (evento.target.value === '') {
            return
        }
        seleccionarUsuario(Number(evento.target.value))
        // El nuevo usuario puede no tener permiso para la pagina actual
        void navegar(RUTAS.inicio)
    }

    return (
        <div className="w-80">
            <Selector
                etiqueta="Usuario simulado"
                ocultarEtiqueta
                opciones={opciones}
                textoVacio={cargando ? 'Cargando usuarios…' : 'Seleccione un usuario'}
                value={usuarioSimuladoId ?? ''}
                onChange={cambiarUsuario}
                disabled={cargando}
            />
        </div>
    )
}
