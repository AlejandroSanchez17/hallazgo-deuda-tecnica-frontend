import { useSesionStore } from '../../store/sesionStore'
import type { Alcance, UsuarioActual } from '../../types/usuario.types'

// Sin permiso indicado, la opcion es para todos; con una lista basta con uno de ellos
export const tienePermiso = (usuario: UsuarioActual | null, permiso?: string | string[]) => {
    if (permiso === undefined) {
        return true
    }
    const buscados = Array.isArray(permiso) ? permiso : [permiso]
    return usuario?.permisos.some((p) => buscados.includes(p.codigo)) ?? false
}

export const usePermiso = (permiso?: string | string[]) =>
    useSesionStore((estado) => tienePermiso(estado.usuario, permiso))

// Con alcance PROPIO el permiso solo vale para el equipo o las tareas del usuario
export const usePermisoConAlcance = (permiso: string, alcance: Alcance) =>
    useSesionStore(
        (estado) => estado.usuario?.permisos.some((p) => p.codigo === permiso && p.alcance === alcance) ?? false,
    )
