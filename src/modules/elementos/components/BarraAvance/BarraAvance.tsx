import { spacing } from '@hnba/design-tokens'
import { ProgressBar, Text } from '@hnba/react-ui'
import { columna } from '../../../../styles/disposicion'
import { textoPorcentaje } from '../../textosPlan'

interface BarraAvanceProps {
    valor: number
    ancho: number
    // El numero a la izquierda de la barra (resumen) o encima (tablas)
    enLinea?: boolean
}

// Avance de una tarea o del plan: el numero y la barra de la libreria
export const BarraAvance = ({ valor, ancho, enLinea = false }: BarraAvanceProps) => (
    <div
        style={
            enLinea
                ? { display: 'flex', alignItems: 'center', gap: spacing.sm }
                : { ...columna(spacing.xs), alignItems: 'center' }
        }
    >
        <Text variant="body-regular-medium">{textoPorcentaje(valor)}</Text>
        <ProgressBar
            value={valor}
            height={6}
            aria-label={`Avance ${textoPorcentaje(valor)}`}
            style={{ width: ancho }}
        />
    </div>
)
