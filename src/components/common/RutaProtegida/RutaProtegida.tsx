import type { ReactNode } from 'react'
import type { Alcance } from '../../../types/usuario.types'
import { usePermiso } from '../../../hooks/auth/usePermiso'
import { SinPermisoPage } from '../../../pages/Error/SinPermisoPage/SinPermisoPage'

interface RutaProtegidaProps {
    // Con una lista basta con uno de ellos
    permiso: string | string[]
    // Si se indica, el permiso tiene que tenerlo con ese alcance
    alcance?: Alcance
    children: ReactNode
}

// Solo es comodidad: la seguridad real la aplica el backend
export const RutaProtegida = ({ permiso, alcance, children }: RutaProtegidaProps) => {
    const permitido = usePermiso(permiso, alcance)
    return permitido ? <>{children}</> : <SinPermisoPage />
}
