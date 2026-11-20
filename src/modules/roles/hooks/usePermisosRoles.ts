import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'

// Ver roles y permisos lo decide la ruta (USUARIO:LEER); crear, editar, activar o desactivar y borrar roles
// piden USUARIO:CREAR, USUARIO:ACTUALIZAR y USUARIO:DESACTIVAR
export const usePermisosRoles = () => ({
    puedeCrear: usePermiso(PERMISOS.usuarioCrear),
    puedeActualizar: usePermiso(PERMISOS.usuarioActualizar),
    puedeBorrar: usePermiso(PERMISOS.usuarioDesactivar),
})
