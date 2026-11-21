import { spacing } from '@hnba/design-tokens'
import { ProgressBar, Text } from '@hnba/react-ui'

interface CeldaBarraProps {
    valor: number
    // El mayor de la tabla: su barra queda llena
    maximo: number
    texto: string
    etiqueta: string
}

// Barra horizontal de una tabla del tablero (la libreria no trae graficos de barras): el numero y su barra
export const CeldaBarra = ({ valor, maximo, texto, etiqueta }: CeldaBarraProps) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, minWidth: 96 }}>
        <Text variant="body-bold-medium" as="span" style={{ minWidth: 40, textAlign: 'right', whiteSpace: 'nowrap' }}>
            {texto}
        </Text>
        <ProgressBar
            value={maximo === 0 ? 0 : (valor / maximo) * 100}
            height={8}
            aria-label={etiqueta}
            style={{ flex: 1 }}
        />
    </div>
)
