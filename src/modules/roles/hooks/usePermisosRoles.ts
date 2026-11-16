import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'

// Ver roles y permisos lo decide la ruta (USUARIO:LEER); editar y activar o desactivar roles, USUARIO:ACTUALIZAR
export const usePermisosRoles = () => ({
    puedeActualizar: usePermiso(PERMISOS.usuarioActualizar),
})
