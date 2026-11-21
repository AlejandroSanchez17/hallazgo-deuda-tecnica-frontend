import { useCallback } from 'react'
import { usePermiso, usePermisoConAlcance } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { PERMISOS } from '../../../utils/constants/permisos'
import type { ElementoResponse, EstadoElemento } from '../types'

const ESTADOS_FINALES: EstadoElemento[] = ['CERRADO', 'ANULADO']
// Anular es la forma de corregir una fecha mal registrada; despues del plan ya no se puede (422 en estado)
const ESTADOS_ANULABLES: EstadoElemento[] = ['REGISTRADO', 'PLAN_EN_ELABORACION']

// Ver la lista lo decide la ruta (ELEMENTO:LEER)
export const usePermisosElementos = () => {
    const usuarioId = useSesionStore((estado) => estado.usuario?.id)
    const actualizar = usePermiso(PERMISOS.elementoActualizar)
    const actualizarTodo = usePermisoConAlcance(PERMISOS.elementoActualizar, 'TODO')
    const desactivar = usePermiso(PERMISOS.elementoDesactivar)

    // Con alcance PROPIO solo el lider vigente edita; cerrados y anulados no se editan (422)
    const puedeEditar = useCallback(
        (elemento: ElementoResponse) =>
            !ESTADOS_FINALES.includes(elemento.estado) &&
            (actualizarTodo || (actualizar && usuarioId !== undefined && elemento.liderId === usuarioId)),
        [actualizar, actualizarTodo, usuarioId],
    )

    // Cambiar el equipo de un elemento pide alcance TODO: con PROPIO el backend responde 403
    const puedeReasignar = (elemento: ElementoResponse) => !ESTADOS_FINALES.includes(elemento.estado) && actualizarTodo

    return {
        puedeCrear: usePermiso(PERMISOS.elementoCrear),
        // Sin ACTUALIZAR no se dibuja la columna Editar
        muestraEditar: actualizar,
        puedeEditar,
        puedeReasignar,
        puedeAnular: (elemento: ElementoResponse) => desactivar && ESTADOS_ANULABLES.includes(elemento.estado),
        veRestringidas: usePermiso(PERMISOS.deudaRestringidaLeer),
    }
}
