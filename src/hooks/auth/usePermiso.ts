import { useSesionStore } from '../../store/sesionStore'
import type { Alcance, UsuarioActual } from '../../types/usuario.types'

// Sin permiso indicado, la opcion es para todos; con una lista basta con uno de ellos.
// Con alcance, el permiso tiene que tenerlo con ese alcance (el tablero pide TODO: no es para lideres ni miembros)
export const tienePermiso = (usuario: UsuarioActual | null, permiso?: string | string[], alcance?: Alcance) => {
    if (permiso === undefined) {
        return true
    }
    const buscados = Array.isArray(permiso) ? permiso : [permiso]
    return (
        usuario?.permisos.some(
            (p) => buscados.includes(p.codigo) && (alcance === undefined || p.alcance === alcance),
        ) ?? false
    )
}

export const usePermiso = (permiso?: string | string[], alcance?: Alcance) =>
    useSesionStore((estado) => tienePermiso(estado.usuario, permiso, alcance))

// Con alcance PROPIO el permiso solo vale para el equipo o las tareas del usuario
export const usePermisoConAlcance = (permiso: string, alcance: Alcance) =>
    useSesionStore(
        (estado) => estado.usuario?.permisos.some((p) => p.codigo === permiso && p.alcance === alcance) ?? false,
    )
