import { Alert, Loader, Text } from '@hnba/react-ui'
import { Outlet } from 'react-router-dom'
import { useUsuarioActual } from '../../../hooks/auth/useUsuarioActual'
import { textoSecundario } from '../../../styles/disposicion'

// Las paginas solo se muestran con el usuario y sus permisos ya cargados
export const ContenidoPrincipal = () => {
    const { usuario, cargando, error } = useUsuarioActual()

    if (cargando) {
        return <Loader label="Cargando su sesión…" />
    }
    if (error) {
        return <Alert variant="error" description={error.mensaje} />
    }
    if (!usuario) {
        return (
            <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                Seleccione un usuario en la parte superior para empezar.
            </Text>
        )
    }
    return <Outlet />
}
