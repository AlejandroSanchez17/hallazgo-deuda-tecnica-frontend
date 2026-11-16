import { Sidebar as SidebarBase, type IconName, type SidebarNavItem } from '@hnba/react-ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { tienePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { OPCIONES_MENU, type OpcionMenu } from '../../../utils/constants/menu'
import { RUTAS } from '../../../utils/constants/rutas'

const ICONOS: Record<string, IconName> = {
    [RUTAS.inicio]: 'house',
    [RUTAS.catalogos]: 'book_open_lines',
    [RUTAS.usuarios]: 'users',
    [RUTAS.roles]: 'key',
    [RUTAS.equipos]: 'groups',
    [RUTAS.parametros]: 'gears',
}

interface SidebarProps {
    // Se llama despues de navegar; el menu movil lo usa para cerrarse
    alNavegar?: () => void
    // Ancho en px; sin valor se usa el de la libreria (320)
    ancho?: number
}

// Una opcion con hijos no navega (solo se despliega); los hijos que el usuario no puede ver se quitan
const aItem = (opcion: OpcionMenu, usuario: Parameters<typeof tienePermiso>[0]): SidebarNavItem => ({
    id: opcion.ruta,
    label: opcion.texto,
    iconName: ICONOS[opcion.ruta],
    href: opcion.hijos ? undefined : opcion.ruta,
    children: opcion.hijos?.filter((hijo) => tienePermiso(usuario, hijo.permiso)).map((hijo) => aItem(hijo, usuario)),
})

export const Sidebar = ({ alNavegar, ancho }: SidebarProps) => {
    const usuario = useSesionStore((estado) => estado.usuario)
    const { pathname } = useLocation()
    const navegar = useNavigate()

    const items = OPCIONES_MENU.filter((opcion) => tienePermiso(usuario, opcion.permiso)).map((opcion) =>
        aItem(opcion, usuario),
    )
    // Al abrir la pagina, el grupo de la pantalla actual ya sale desplegado
    const desplegados = OPCIONES_MENU.filter((opcion) => opcion.hijos?.some((hijo) => hijo.ruta === pathname)).map(
        (opcion) => opcion.ruta,
    )

    const irA = (href: string) => {
        void navegar(href)
        alNavegar?.()
    }

    return (
        <SidebarBase
            items={items}
            currentPath={pathname}
            onNavigate={irA}
            defaultExpandedIds={desplegados}
            navAriaLabel="Menú principal"
            style={ancho === undefined ? undefined : { width: ancho }}
        />
    )
}
