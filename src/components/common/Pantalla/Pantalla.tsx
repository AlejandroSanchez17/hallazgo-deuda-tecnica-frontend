import { spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, textoSecundario } from '../../../styles/disposicion'

interface PantallaProps {
    titulo: string
    // Frase corta bajo el titulo que dice para que sirve la pantalla
    descripcion: string
    // Lo que va a la derecha del titulo (por ejemplo, el selector de periodo); en pantallas angostas baja debajo
    acciones?: ReactNode
    // Enlace para regresar (EnlaceVolver); va encima del titulo
    volver?: ReactNode
    children: ReactNode
}

// Estructura de una pantalla: titulo (el h1 de la pagina) y descripcion arriba, y el contenido debajo.
// Los botones de una lista van junto a la tabla, en la fila del buscador; los de un detalle, en acciones (AccionesPantalla)
export const Pantalla = ({ titulo, descripcion, acciones, volver, children }: PantallaProps) => (
    <section style={columna(spacing.lg)}>
        <div style={columna(spacing.xs)}>
            {volver && <div>{volver}</div>}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: spacing.md,
                }}
            >
                <div style={{ ...columna(4), flex: '1 1 200px', minWidth: 0 }}>
                    <Text variant="h3" as="h1" style={{ margin: 0 }}>
                        {titulo}
                    </Text>
                    <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                        {descripcion}
                    </Text>
                </div>
                {acciones}
            </div>
        </div>
        {children}
    </section>
)
