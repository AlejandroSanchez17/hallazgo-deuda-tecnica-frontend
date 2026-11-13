import { MenuItem, NavBar, useToast } from '@hnba/react-ui'
import { useCambioUsuario } from '../../../hooks/auth/useCambioUsuario'
import { nombreRoles } from '../../../utils/texto'

// La libreria trae 16 px de relleno vertical y botones de 60 px (alto ~94 px). Con los botones en 48 px
// (ver .navbar-compacto en globals.css) este relleno deja el alto en ~74 px
const ESTILO_COMPACTO = { paddingTop: 12, paddingBottom: 12 }

interface HeaderProps {
    // En modo compacto el menu lateral no cabe en pantalla: el NavBar ofrece este boton para abrirlo
    onAbrirMenu: () => void
}

export const Header = ({ onAbrirMenu }: HeaderProps) => {
    const { usuarios, cargando, usuarioActual, cambiarUsuario } = useCambioUsuario()
    const { toast } = useToast()

    const menuUsuarios = (
        <>
            {usuarios.map((usuario) => (
                <MenuItem
                    key={usuario.id}
                    iconName={usuario.id === usuarioActual?.id ? 'check' : undefined}
                    onClick={() => cambiarUsuario(usuario.id)}
                >
                    {`${usuario.nombre} · ${nombreRoles(usuario.roles)}`}
                </MenuItem>
            ))}
            {usuarios.length === 0 && <MenuItem disabled>{cargando ? 'Cargando usuarios…' : 'Sin usuarios'}</MenuItem>}
        </>
    )

    return (
        <NavBar
            fullName={usuarioActual?.nombre ?? (cargando ? 'Cargando…' : 'Seleccione un usuario')}
            subtitle={usuarioActual ? nombreRoles(usuarioActual.roles) : undefined}
            userMenu={menuUsuarios}
            showUserIdentity
            showChevron
            className="navbar-compacto"
            style={ESTILO_COMPACTO}
            logoTitle="Hallazgos y Deuda Técnica"
            actions={[
                {
                    id: 'notifications',
                    ariaLabel: 'Notificaciones',
                    iconName: 'bell',
                    // Temporal: aun no existe el modulo de notificaciones
                    onClick: () => toast({ variant: 'info', title: 'Las notificaciones estarán disponibles pronto' }),
                },
                {
                    id: 'menu',
                    ariaLabel: 'Abrir menú de navegación',
                    iconName: 'bars',
                    onClick: onAbrirMenu,
                    showOn: 'compact',
                },
            ]}
        />
    )
}
