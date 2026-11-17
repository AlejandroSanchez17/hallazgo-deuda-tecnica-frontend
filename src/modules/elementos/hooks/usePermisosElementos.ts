import { useCallback } from 'react'
import { usePermiso, usePermisoConAlcance } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { PERMISOS } from '../../../utils/constants/permisos'
import type { ElementoResponse } from '../types'

const ESTADOS_FINALES = ['CERRADO', 'ANULADO']

// Ver la lista lo decide la ruta (ELEMENTO:LEER)
export const usePermisosElementos = () => {
    const usuarioId = useSesionStore((estado) => estado.usuario?.id)
    const actualizar = usePermiso(PERMISOS.elementoActualizar)
    const actualizarTodo = usePermisoConAlcance(PERMISOS.elementoActualizar, 'TODO')

    // Con alcance PROPIO solo el lider vigente del equipo edita; cerrados y anulados no se editan (422)
    const puedeEditar = useCallback(
        (elemento: ElementoResponse) =>
            !ESTADOS_FINALES.includes(elemento.estado) &&
            (actualizarTodo || (actualizar && usuarioId !== undefined && elemento.liderId === usuarioId)),
        [actualizar, actualizarTodo, usuarioId],
    )

    return {
        puedeCrear: usePermiso(PERMISOS.elementoCrear),
        // Sin ACTUALIZAR no se dibuja la columna Editar
        muestraEditar: actualizar,
        puedeEditar,
        veRestringidas: usePermiso(PERMISOS.deudaRestringidaLeer),
    }
}
