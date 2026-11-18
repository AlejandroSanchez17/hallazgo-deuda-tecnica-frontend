import { spacing } from '@hnba/design-tokens'
import { Badge, Card, Text } from '@hnba/react-ui'
import { fila, textoSecundario } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { SEMAFORO, TEXTO_ESTADO, textoDias } from '../../textos'
import type { ElementoDetalleResponse } from '../../types'

interface FranjaElementoProps {
    ficha: ElementoDetalleResponse
}

const dato = (titulo: string, valor: string) => (
    <Text variant="body-regular-medium">
        <span style={textoSecundario}>{titulo}: </span>
        {valor}
    </Text>
)

// Lo del elemento que importa al armar el plan: su estado y la fecha que las tareas no pueden pasar
export const FranjaElemento = ({ ficha }: FranjaElementoProps) => (
    <Card padding={16}>
        <div style={fila(spacing.lg)}>
            <Badge
                status={ficha.estado === 'ANULADO' ? 'error' : ficha.estado === 'CERRADO' ? 'success' : 'info'}
                label={TEXTO_ESTADO[ficha.estado]}
            />
            {dato('Criticidad', ficha.criticidadNombre)}
            {dato('Equipo', ficha.equipoNombre)}
            {dato('Compromiso del elemento', formatearFecha(ficha.fechaCompromisoVigente))}
            {ficha.semaforo && (
                <div style={fila(spacing.sm)}>
                    <Badge status={SEMAFORO[ficha.semaforo].estado} label={SEMAFORO[ficha.semaforo].texto} />
                    <Text variant="body-regular-medium">{textoDias(ficha.diasRestantes)}</Text>
                </div>
            )}
        </div>
    </Card>
)
