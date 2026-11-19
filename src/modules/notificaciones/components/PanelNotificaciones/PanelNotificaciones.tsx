import { spacing } from '@hnba/design-tokens'
import { Button, Modal } from '@hnba/react-ui'
import { useNavigate } from 'react-router-dom'
import { useNotificacionesStore } from '../../../../store/notificacionesStore'
import { columna } from '../../../../styles/disposicion'
import { RUTAS } from '../../../../utils/constants/rutas'
import { useAbrirNotificacion } from '../../hooks/useAbrirNotificacion'
import { useMarcarTodas } from '../../hooks/useMarcarTodas'
import { useNotificaciones } from '../../hooks/useNotificaciones'
import { textoSinLeer } from '../../textos'
import { ContenidoNotificaciones } from '../ContenidoNotificaciones/ContenidoNotificaciones'

const ULTIMAS = 10

interface PanelNotificacionesProps {
    onCerrar: () => void
}

// Se monta al abrir la campana: cada apertura pide de nuevo las ultimas. Sin size (560 px): a 420 px los mensajes
// quedaban en tres o cuatro lineas
export const PanelNotificaciones = ({ onCerrar }: PanelNotificacionesProps) => {
    const total = useNotificacionesStore((estado) => estado.total)
    const lista = useNotificaciones({ soloNoLeidas: false, pagina: 0, tamano: ULTIMAS })
    const abrir = useAbrirNotificacion({ onMarcada: lista.marcarLocal, onNavegar: onCerrar })
    const { marcarTodas, marcando } = useMarcarTodas(lista.recargar)
    const navegar = useNavigate()
    const hayNoLeidas = total > 0 || lista.notificaciones.some((notificacion) => !notificacion.leida)

    const verTodas = () => {
        onCerrar()
        void navegar(RUTAS.notificaciones)
    }

    return (
        <Modal
            open
            onClose={onCerrar}
            position="right"
            title="Notificaciones"
            subtitle={textoSinLeer(total)}
            footer={
                <Button variant="primary" onClick={verTodas}>
                    Ver todas
                </Button>
            }
        >
            <div style={columna(spacing.md)}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="sm"
                        iconName="double_check"
                        disabled={!hayNoLeidas || marcando}
                        onClick={marcarTodas}
                    >
                        Marcar todas como leídas
                    </Button>
                </div>
                <ContenidoNotificaciones
                    cargando={lista.cargando}
                    notificaciones={lista.notificaciones}
                    onAbrir={abrir}
                />
            </div>
        </Modal>
    )
}
