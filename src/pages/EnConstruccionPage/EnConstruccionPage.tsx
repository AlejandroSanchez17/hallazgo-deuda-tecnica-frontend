import { Text } from '@hnba/react-ui'
import { textoSecundario } from '../../styles/disposicion'

interface EnConstruccionPageProps {
    titulo: string
}

// Temporal: ocupa las rutas del menu hasta que exista su pantalla
export const EnConstruccionPage = ({ titulo }: EnConstruccionPageProps) => (
    <section style={{ maxWidth: 672 }}>
        <Text variant="h3" as="h1" style={{ margin: 0 }}>
            {titulo}
        </Text>
        <Text variant="body-regular-medium" as="p" style={textoSecundario}>
            Esta pantalla está en construcción.
        </Text>
    </section>
)
