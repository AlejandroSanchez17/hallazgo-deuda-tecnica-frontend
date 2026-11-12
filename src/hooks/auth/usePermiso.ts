import { useSesionStore } from '../../store/sesionStore'
import type { UsuarioActual } from '../../types/usuario.types'

// Sin permiso indicado, la opcion es para todos
export const tienePermiso = (usuario: UsuarioActual | null, permiso?: string) =>
    permiso === undefined || (usuario?.permisos.some((p) => p.codigo === permiso) ?? false)

export const usePermiso = (permiso?: string) => useSesionStore((estado) => tienePermiso(estado.usuario, permiso))
