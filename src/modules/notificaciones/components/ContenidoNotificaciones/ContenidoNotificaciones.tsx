import { EmptyState, Loader } from '@hnba/react-ui'
import type { NotificacionResponse } from '../../types'
import { ListaNotificaciones } from '../ListaNotificaciones/ListaNotificaciones'

interface ContenidoNotificacionesProps {
    cargando: boolean
    notificaciones: NotificacionResponse[]
    soloNoLeidas?: boolean
    onAbrir: (notificacion: NotificacionResponse) => void
}

// Lo comparten el panel de la campana y el centro: cargando, vacio o la lista
export const ContenidoNotificaciones = ({
    cargando,
    notificaciones,
    soloNoLeidas = false,
    onAbrir,
}: ContenidoNotificacionesProps) => {
    if (cargando) {
        return <Loader />
    }
    if (notificaciones.length === 0) {
        return (
            <EmptyState
                iconName="bell"
                title={soloNoLeidas ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
                description="Aquí llegan las asignaciones, las aprobaciones y los vencimientos próximos."
            />
        )
    }
    return <ListaNotificaciones notificaciones={notificaciones} onAbrir={onAbrir} />
}
