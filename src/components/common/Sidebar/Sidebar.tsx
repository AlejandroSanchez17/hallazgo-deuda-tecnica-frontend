import { Sidebar as SidebarBase, type IconName, type SidebarNavItem } from '@hnba/react-ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { tienePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { OPCIONES_MENU, type OpcionMenu } from '../../../utils/constants/menu'
import { RUTAS } from '../../../utils/constants/rutas'

type Usuario = Parameters<typeof tienePermiso>[0]

// La libreria solo dibuja el icono en el primer nivel
const ICONOS: Record<string, IconName> = {
    [RUTAS.inicio]: 'house',
    [RUTAS.elementos]: 'clipboard_list',
    [RUTAS.administracion]: 'gears',
}

interface SidebarProps {
    // Se llama despues de navegar; el menu movil lo usa para cerrarse
    alNavegar?: () => void
    // Ancho en px; sin valor se usa el de la libreria (320)
    ancho?: number
}

// Un grupo se ve si el usuario puede ver al menos uno de sus hijos (Administración no tiene permiso propio)
const visibles = (opciones: OpcionMenu[], usuario: Usuario): OpcionMenu[] =>
    opciones
        .filter((opcion) => tienePermiso(usuario, opcion.permiso))
        .map((opcion) => (opcion.hijos ? { ...opcion, hijos: visibles(opcion.hijos, usuario) } : opcion))
        .filter((opcion) => !opcion.hijos || opcion.hijos.length > 0)

// Una opcion con hijos no navega (solo se despliega)
const aItem = (opcion: OpcionMenu): SidebarNavItem => ({
    id: opcion.ruta,
    label: opcion.texto,
    iconName: ICONOS[opcion.ruta],
    href: opcion.hijos ? undefined : opcion.ruta,
    children: opcion.hijos?.map(aItem),
})

// La pantalla actual o una de sus paginas internas (por ejemplo /equipos/5 es de Equipos técnicos)
const esPantallaActual = (opcion: OpcionMenu, pathname: string) =>
    opcion.ruta === pathname || (opcion.ruta !== RUTAS.inicio && pathname.startsWith(`${opcion.ruta}/`))

// Grupos que contienen la pantalla actual, a cualquier nivel
const gruposDe = (opciones: OpcionMenu[], pathname: string): string[] =>
    opciones.flatMap((opcion) => {
        if (!opcion.hijos) {
            return []
        }
        const internos = gruposDe(opcion.hijos, pathname)
        const contiene = internos.length > 0 || opcion.hijos.some((hijo) => esPantallaActual(hijo, pathname))
        return contiene ? [opcion.ruta, ...internos] : []
    })

// Ruta de la opcion del menu de la pantalla actual: en /elementos/5 se marca Hallazgos y deuda
const rutaDeOpcion = (opciones: OpcionMenu[], pathname: string): string | undefined => {
    for (const opcion of opciones) {
        const ruta = opcion.hijos ? rutaDeOpcion(opcion.hijos, pathname) : undefined
        if (ruta) {
            return ruta
        }
        if (!opcion.hijos && esPantallaActual(opcion, pathname)) {
            return opcion.ruta
        }
    }
    return undefined
}

export const Sidebar = ({ alNavegar, ancho }: SidebarProps) => {
    const usuario = useSesionStore((estado) => estado.usuario)
    const { pathname } = useLocation()
    const navegar = useNavigate()

    const opciones = visibles(OPCIONES_MENU, usuario)
    // Al abrir la pagina, los grupos de la pantalla actual ya salen desplegados. Sobre el menu completo: la libreria
    // solo lee esta lista al montarse, y puede montarse antes de que lleguen los permisos
    const desplegados = gruposDe(OPCIONES_MENU, pathname)

    const irA = (href: string) => {
        void navegar(href)
        alNavegar?.()
    }

    return (
        <SidebarBase
            items={opciones.map(aItem)}
            currentPath={rutaDeOpcion(OPCIONES_MENU, pathname) ?? pathname}
            onNavigate={irA}
            defaultExpandedIds={desplegados}
            navAriaLabel="Menú principal"
            style={ancho === undefined ? undefined : { width: ancho }}
        />
    )
}
