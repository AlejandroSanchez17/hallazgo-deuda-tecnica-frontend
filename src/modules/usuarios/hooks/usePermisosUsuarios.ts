import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'

// Ver usuarios, roles y permisos lo decide la ruta (USUARIO:LEER)
export const usePermisosUsuarios = () => ({
    puedeCrear: usePermiso(PERMISOS.usuarioCrear),
    puedeActualizar: usePermiso(PERMISOS.usuarioActualizar),
    puedeDesactivar: usePermiso(PERMISOS.usuarioDesactivar),
})
