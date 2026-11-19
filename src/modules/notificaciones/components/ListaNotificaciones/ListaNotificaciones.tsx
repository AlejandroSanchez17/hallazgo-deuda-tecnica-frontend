import { spacing } from '@hnba/design-tokens'
import { Badge, Icon, List, ListItem } from '@hnba/react-ui'
import { fila } from '../../../../styles/disposicion'
import { formatearFechaHora, formatearHace } from '../../../../utils/formato'
import { datosDeTipo } from '../../textos'
import type { NotificacionResponse } from '../../types'

// ListItem corta el titulo y el subtitulo en una linea con "…"; el mensaje completo es lo que importa, asi que salta
const textoCompleto = { whiteSpace: 'normal', overflowWrap: 'break-word' } as const

interface ListaNotificacionesProps {
    notificaciones: NotificacionResponse[]
    onAbrir: (notificacion: NotificacionResponse) => void
}

// Sin leer: el mensaje en negrita y la etiqueta "Nueva". Una leida sin elemento (el resumen semanal) no hace nada
// al tocarla, asi que queda como fila de solo lectura
export const ListaNotificaciones = ({ notificaciones, onAbrir }: ListaNotificacionesProps) => (
    <List dividers>
        {notificaciones.map((notificacion) => {
            const tipo = datosDeTipo(notificacion.tipo)
            const seAbre = !notificacion.leida || notificacion.elementoId !== null
            const detalle = [tipo.nombre, formatearHace(notificacion.fecha)]
            return (
                <ListItem
                    key={notificacion.id}
                    iconName={tipo.icono}
                    title={
                        <span style={{ ...textoCompleto, fontWeight: notificacion.leida ? 400 : 700 }}>
                            {notificacion.mensaje}
                        </span>
                    }
                    subtitle={
                        <span style={textoCompleto} title={formatearFechaHora(notificacion.fecha)}>
                            {detalle.join(' · ')}
                        </span>
                    }
                    trailing={
                        <span style={fila(spacing.sm)}>
                            {!notificacion.leida && <Badge status="info" label="Nueva" />}
                            {notificacion.elementoId !== null && <Icon name="chevron_right" size={16} />}
                        </span>
                    }
                    onClick={seAbre ? () => onAbrir(notificacion) : undefined}
                />
            )
        })}
    </List>
)
