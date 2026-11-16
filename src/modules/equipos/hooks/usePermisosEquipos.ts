import { usePermiso, usePermisoConAlcance } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { PERMISOS } from '../../../utils/constants/permisos'

// Ver la lista y el detalle lo decide la ruta (EQUIPO:LEER). liderId es el lider vigente del equipo abierto
export const usePermisosEquipos = (liderId?: number | null) => {
    const usuarioId = useSesionStore((estado) => estado.usuario?.id)
    const actualizar = usePermiso(PERMISOS.equipoActualizar)
    // Editar los datos y cambiar el lider exigen alcance TODO; el Lider tecnico (PROPIO) recibiria 403
    const actualizarTodo = usePermisoConAlcance(PERMISOS.equipoActualizar, 'TODO')
    // Con alcance PROPIO solo el lider vigente cambia los miembros; un ex lider solo ve el equipo
    const esLiderVigente = usuarioId !== undefined && liderId === usuarioId
    const cambiaMiembros = actualizarTodo || (actualizar && esLiderVigente)

    return {
        puedeCrear: usePermiso(PERMISOS.equipoCrear),
        puedeDesactivar: usePermiso(PERMISOS.equipoDesactivar),
        puedeEditar: actualizarTodo,
        puedeCambiarLider: actualizarTodo,
        puedeAgregarMiembro: cambiaMiembros,
        puedeRetirarMiembro: cambiaMiembros,
    }
}
