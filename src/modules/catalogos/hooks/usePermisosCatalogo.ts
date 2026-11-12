import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'

export const usePermisosCatalogo = () => ({
    puedeCrear: usePermiso(PERMISOS.catalogoCrear),
    puedeActualizar: usePermiso(PERMISOS.catalogoActualizar),
    puedeDesactivar: usePermiso(PERMISOS.catalogoDesactivar),
})
