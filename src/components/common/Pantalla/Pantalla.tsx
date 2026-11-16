import { spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, textoSecundario } from '../../../styles/disposicion'

interface PantallaProps {
    titulo: string
    // Frase corta bajo el titulo que dice para que sirve la pantalla
    descripcion: string
    children: ReactNode
}

// Estructura de una pantalla: titulo (el h1 de la pagina) y descripcion arriba, y el contenido debajo.
// Los botones de la pantalla van junto a la tabla, en la fila del buscador
export const Pantalla = ({ titulo, descripcion, children }: PantallaProps) => (
    <section style={columna(spacing.lg)}>
        <div style={columna(4)}>
            <Text variant="h3" as="h1" style={{ margin: 0 }}>
                {titulo}
            </Text>
            <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                {descripcion}
            </Text>
        </div>
        {children}
    </section>
)
