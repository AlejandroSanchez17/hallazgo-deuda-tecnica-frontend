import { spacing } from '@hnba/design-tokens'
import { Badge, Card, ProgressBar, Text } from '@hnba/react-ui'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'

interface TarjetaKpiProps {
    titulo: string
    valor: string
    // "6 de 7 cerrados"; vacio si no aplica
    detalle: string
    calculo: string
    // El periodo solo cambia algunos indicadores; los demas son la foto de hoy
    delPeriodo: boolean
    // Porcentaje (0 a 100) para dibujar la barra bajo la cifra; null si no hay base
    progreso?: number | null
}

export const TarjetaKpi = ({ titulo, valor, detalle, calculo, delPeriodo, progreso }: TarjetaKpiProps) => (
    <Card padding={spacing.md} style={{ height: '100%' }}>
        <div style={columna(spacing.sm)}>
            <div style={{ ...filaEntreExtremos, alignItems: 'center', flexWrap: 'nowrap' }}>
                <Text variant="body-bold-medium" as="h3" style={{ margin: 0 }}>
                    {titulo}
                </Text>
                <Badge status={delPeriodo ? 'info' : 'neutral'} label={delPeriodo ? 'Período' : 'Hoy'} />
            </div>
            <Text variant="h3" as="p" style={{ margin: 0 }}>
                {valor}
            </Text>
            {progreso !== undefined && (
                <ProgressBar value={progreso ?? 0} height={8} aria-label={`${titulo}: ${valor}`} />
            )}
            {detalle !== '' && (
                <Text variant="body-bold-small" as="p" style={textoSecundario}>
                    {detalle}
                </Text>
            )}
            {calculo !== '' && (
                <Text variant="body-regular-small" as="p" style={textoSecundario}>
                    {calculo}
                </Text>
            )}
        </div>
    </Card>
)
