import { spacing } from '@hnba/design-tokens'
import { Card, Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, textoSecundario } from '../../../../styles/disposicion'

interface BloqueProps {
    titulo: string
    // Que muestra y de donde sale el numero
    nota?: string
    children: ReactNode
}

// Una tarjeta del tablero con su titulo; las tablas van dentro a todo el ancho
export const Bloque = ({ titulo, nota, children }: BloqueProps) => (
    <Card padding={spacing.md} style={{ minWidth: 0 }}>
        <div style={columna(spacing.sm)}>
            <div style={columna(spacing.xs)}>
                <Text variant="body-bold-large" as="h2" style={{ margin: 0 }}>
                    {titulo}
                </Text>
                {nota && (
                    <Text variant="body-regular-small" as="p" style={textoSecundario}>
                        {nota}
                    </Text>
                )}
            </div>
            {children}
        </div>
    </Card>
)
