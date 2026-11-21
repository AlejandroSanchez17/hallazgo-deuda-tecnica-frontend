import { Navigate } from 'react-router-dom'
import { usePermiso } from '../../hooks/auth/usePermiso'
import { PERMISOS } from '../../utils/constants/permisos'
import { RUTAS } from '../../utils/constants/rutas'
import { InicioPage } from '../InicioPage/InicioPage'

// Seccion 11.4: quien puede ser responsable de tareas entra a Mis tareas; quien lee reportes con alcance TODO, al tablero
export const InicioSegunRol = () => {
    const tieneTareas = usePermiso(PERMISOS.tareaActualizar)
    const leeTablero = usePermiso(PERMISOS.reporteLeer, 'TODO')

    if (tieneTareas) {
        return <Navigate to={RUTAS.misTareas} replace />
    }
    if (leeTablero) {
        return <Navigate to={RUTAS.tablero} replace />
    }
    return <InicioPage />
}
