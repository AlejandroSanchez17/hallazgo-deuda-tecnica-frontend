import { useEffect, useState } from 'react'
import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'
import { listarRolesActivos } from '../api'
import type { RolActivo } from '../types'

// GET /roles pide USUARIO:LEER o CATALOGO:ACTUALIZAR: sin ninguno de los dos no se pide (evita un 403) y la lista queda vacia
export const useRolesActivos = (): RolActivo[] => {
    const puede = usePermiso([PERMISOS.usuarioLeer, PERMISOS.catalogoActualizar])
    const [roles, setRoles] = useState<RolActivo[]>([])

    useEffect(() => {
        if (!puede) {
            return
        }
        let vigente = true
        listarRolesActivos()
            .then((lista) => vigente && setRoles(lista))
            // Sin la lista el valor se muestra y se edita como numero
            .catch(() => undefined)
        return () => {
            vigente = false
        }
    }, [puede])

    return puede ? roles : []
}
