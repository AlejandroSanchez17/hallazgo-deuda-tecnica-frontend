import { NavLink } from 'react-router-dom'
import { tienePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { OPCIONES_MENU } from '../../../utils/constants/menu'
import { RUTAS } from '../../../utils/constants/rutas'

const clasesOpcion = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-primario-claro font-semibold text-texto' : 'text-texto-secundario hover:bg-fondo'}`

export const Sidebar = () => {
    const usuario = useSesionStore((estado) => estado.usuario)
    const opciones = OPCIONES_MENU.filter((opcion) => tienePermiso(usuario, opcion.permiso))

    return (
        <nav className="w-56 shrink-0 border-r border-borde bg-blanco p-3" aria-label="Menú principal">
            <ul className="space-y-1">
                {opciones.map((opcion) => (
                    <li key={opcion.ruta}>
                        <NavLink to={opcion.ruta} end={opcion.ruta === RUTAS.inicio} className={clasesOpcion}>
                            {opcion.texto}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
