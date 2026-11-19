import { MenuItem, NavBar } from '@hnba/react-ui'
import { useState, type CSSProperties } from 'react'
import { useCambioUsuario } from '../../../hooks/auth/useCambioUsuario'
import { useContadorNotificaciones } from '../../../hooks/useContadorNotificaciones'
import { PanelNotificaciones } from '../../../modules/notificaciones/components/PanelNotificaciones/PanelNotificaciones'
import { useNotificacionesStore } from '../../../store/notificacionesStore'
import { nombreRoles } from '../../../utils/texto'

// La libreria trae 16 px de relleno vertical y botones de 60 px (alto ~94 px). Con los botones en 48 px
// (ver .navbar-compacto en globals.css) este relleno deja el alto en ~74 px
const ESTILO_COMPACTO = { paddingTop: 12, paddingBottom: 12 }

const MAXIMO_INSIGNIA = 99
const VARIABLE_INSIGNIA = '--insignia-notificaciones'

// El NavBar no trae contador: la insignia la dibuja .navbar-con-avisos (globals.css) con el texto de esta variable
const estiloConInsignia = (total: number): CSSProperties =>
    ({
        ...ESTILO_COMPACTO,
        [VARIABLE_INSIGNIA]: `'${total > MAXIMO_INSIGNIA ? `${MAXIMO_INSIGNIA}+` : total}'`,
    }) as CSSProperties

const etiquetaCampana = (total: number) =>
    total === 0 ? 'Notificaciones, ninguna sin leer' : `Notificaciones, ${total} sin leer`

interface HeaderProps {
    // En modo compacto el menu lateral no cabe en pantalla: el NavBar ofrece este boton para abrirlo
    onAbrirMenu: () => void
}

export const Header = ({ onAbrirMenu }: HeaderProps) => {
    const { usuarios, cargando, usuarioActual, cambiarUsuario } = useCambioUsuario()
    const [panelAbierto, setPanelAbierto] = useState(false)
    useContadorNotificaciones()
    const total = useNotificacionesStore((estado) => estado.total)

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
        <>
            <NavBar
                fullName={usuarioActual?.nombre ?? (cargando ? 'Cargando…' : 'Seleccione un usuario')}
                subtitle={usuarioActual ? nombreRoles(usuarioActual.roles) : undefined}
                userMenu={menuUsuarios}
                showUserIdentity
                showChevron
                className={total > 0 ? 'navbar-compacto navbar-con-avisos' : 'navbar-compacto'}
                style={estiloConInsignia(total)}
                logoTitle="Hallazgos y Deuda Técnica"
                actions={[
                    {
                        id: 'notifications',
                        ariaLabel: etiquetaCampana(total),
                        iconName: 'bell',
                        onClick: () => setPanelAbierto(true),
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
            {panelAbierto && <PanelNotificaciones onCerrar={() => setPanelAbierto(false)} />}
        </>
    )
}
