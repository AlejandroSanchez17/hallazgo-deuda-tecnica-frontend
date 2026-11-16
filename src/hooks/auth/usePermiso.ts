import { useSesionStore } from '../../store/sesionStore'
import type { Alcance, UsuarioActual } from '../../types/usuario.types'

// Sin permiso indicado, la opcion es para todos
export const tienePermiso = (usuario: UsuarioActual | null, permiso?: string) =>
    permiso === undefined || (usuario?.permisos.some((p) => p.codigo === permiso) ?? false)

export const usePermiso = (permiso?: string) => useSesionStore((estado) => tienePermiso(estado.usuario, permiso))

// Con alcance PROPIO el permiso solo vale para el equipo o las tareas del usuario
export const usePermisoConAlcance = (permiso: string, alcance: Alcance) =>
    useSesionStore(
        (estado) => estado.usuario?.permisos.some((p) => p.codigo === permiso && p.alcance === alcance) ?? false,
    )
