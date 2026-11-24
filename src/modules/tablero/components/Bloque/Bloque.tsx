import { spacing } from '@hnba/design-tokens'
import { Card, Text } from '@hnba/react-ui'
import type { CSSProperties, ReactNode } from 'react'
import { columna, textoSecundario } from '../../../../styles/disposicion'

interface BloqueProps {
    titulo: string
    // Que muestra y de donde sale el numero
    nota?: string
    // Ocupa todo el alto de su contenedor (que debe ser position: relative) en vez de crecer con su contenido: asi su
    // alto lo marcan las tarjetas de al lado y el contenido se adapta. Los hijos reciben el resto del alto
    llenaAlto?: boolean
    children: ReactNode
}

const ESTILO_LLENO: CSSProperties = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }

// Una tarjeta del tablero con su titulo; las tablas van dentro a todo el ancho
export const Bloque = ({ titulo, nota, llenaAlto = false, children }: BloqueProps) => (
    <Card padding={spacing.md} style={{ minWidth: 0, ...(llenaAlto ? ESTILO_LLENO : {}) }}>
        <div style={{ ...columna(spacing.sm), ...(llenaAlto ? { flex: 1, minHeight: 0 } : {}) }}>
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
