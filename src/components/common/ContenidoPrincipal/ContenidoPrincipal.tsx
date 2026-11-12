import { Outlet } from 'react-router-dom'
import { useUsuarioActual } from '../../../hooks/auth/useUsuarioActual'
import { Cargando } from '../../ui/Cargando/Cargando'
import { MensajeError } from '../../ui/MensajeError/MensajeError'

// Las paginas solo se muestran con el usuario y sus permisos ya cargados
export const ContenidoPrincipal = () => {
    const { usuario, cargando, error } = useUsuarioActual()

    if (cargando) {
        return <Cargando texto="Cargando su sesión…" />
    }
    if (error) {
        return <MensajeError mensaje={error.mensaje} />
    }
    if (!usuario) {
        return <p className="text-sm text-texto-secundario">Seleccione un usuario en la parte superior para empezar.</p>
    }
    return <Outlet />
}
