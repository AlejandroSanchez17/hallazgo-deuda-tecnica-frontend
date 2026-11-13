import { Sidebar as SidebarBase, type IconName, type SidebarNavItem } from '@hnba/react-ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { tienePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { OPCIONES_MENU } from '../../../utils/constants/menu'
import { RUTAS } from '../../../utils/constants/rutas'

const ICONOS: Record<string, IconName> = {
    [RUTAS.inicio]: 'house',
    [RUTAS.catalogos]: 'book_open_lines',
    [RUTAS.parametros]: 'gears',
}

interface SidebarProps {
    // Se llama despues de navegar; el menu movil lo usa para cerrarse
    alNavegar?: () => void
    // Ancho en px; sin valor se usa el de la libreria (320)
    ancho?: number
}

export const Sidebar = ({ alNavegar, ancho }: SidebarProps) => {
    const usuario = useSesionStore((estado) => estado.usuario)
    const { pathname } = useLocation()
    const navegar = useNavigate()

    const items: SidebarNavItem[] = OPCIONES_MENU.filter((opcion) => tienePermiso(usuario, opcion.permiso)).map(
        (opcion) => ({ id: opcion.ruta, label: opcion.texto, href: opcion.ruta, iconName: ICONOS[opcion.ruta] }),
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
            navAriaLabel="Menú principal"
            style={ancho === undefined ? undefined : { width: ancho }}
        />
    )
}
