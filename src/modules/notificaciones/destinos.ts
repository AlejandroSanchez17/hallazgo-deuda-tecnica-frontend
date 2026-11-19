import { rutaElemento, rutaPestanaElemento, rutaPlanElemento, rutaTareaPlan } from '../../utils/constants/rutas'
import type { NotificacionResponse } from './types'

// A donde lleva cada aviso (script 08). Sin elemento (resumen semanal) no navega. Un destino que el frontend
// todavia no conozca, o un aviso anterior al 08 sin destino, abre la ficha
export const rutaDestino = ({ elementoId, destino, tareaId }: NotificacionResponse): string | null => {
    if (elementoId === null) {
        return null
    }
    switch (destino) {
        case 'PLAN':
            return rutaPlanElemento(elementoId)
        case 'TAREA':
            return tareaId !== null ? rutaTareaPlan(elementoId, tareaId) : rutaPlanElemento(elementoId)
        case 'PRORROGA':
            return rutaPestanaElemento(elementoId, 'prorrogas')
        case 'CIERRE':
            return rutaPestanaElemento(elementoId, 'cierre')
        default:
            return rutaElemento(elementoId)
    }
}
