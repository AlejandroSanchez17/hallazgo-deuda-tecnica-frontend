import { Button, Toggle } from '@hnba/react-ui'
import { filaEntreExtremos } from '../../../../styles/disposicion'

interface BarraNotificacionesProps {
    soloNoLeidas: boolean
    onCambiarFiltro: (soloNoLeidas: boolean) => void
    puedeMarcar: boolean
    onMarcarTodas: () => void
}

export const BarraNotificaciones = ({
    soloNoLeidas,
    onCambiarFiltro,
    puedeMarcar,
    onMarcarTodas,
}: BarraNotificacionesProps) => (
    <div style={{ ...filaEntreExtremos, alignItems: 'center' }}>
        <Toggle label="Solo sin leer" checked={soloNoLeidas} onChange={onCambiarFiltro} />
        <Button variant="primary" iconName="double_check" disabled={!puedeMarcar} onClick={onMarcarTodas}>
            Marcar todas como leídas
        </Button>
    </div>
)
