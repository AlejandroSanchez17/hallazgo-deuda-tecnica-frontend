import type { ReactNode } from 'react'
import { usePermiso } from '../../../hooks/auth/usePermiso'
import { SinPermisoPage } from '../../../pages/Error/SinPermisoPage/SinPermisoPage'

interface RutaProtegidaProps {
    permiso: string
    children: ReactNode
}

// Solo es comodidad: la seguridad real la aplica el backend
export const RutaProtegida = ({ permiso, children }: RutaProtegidaProps) => {
    const permitido = usePermiso(permiso)
    return permitido ? <>{children}</> : <SinPermisoPage />
}
