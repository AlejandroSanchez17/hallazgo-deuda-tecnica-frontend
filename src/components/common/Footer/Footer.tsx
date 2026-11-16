import { spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { env } from '../../../config/env'
import { textoSecundario } from '../../../styles/disposicion'

const estiloPie: CSSProperties = { padding: spacing.lg, textAlign: 'center' }

export const Footer = () => (
    <footer style={estiloPie}>
        <Text variant="body-regular-small" as="p" style={textoSecundario}>
            {`Banco Atlántida © ${new Date().getFullYear()}. Derechos reservados. · v${env.version}`}
        </Text>
    </footer>
)
