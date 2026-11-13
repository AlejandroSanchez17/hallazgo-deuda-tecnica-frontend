import { colors, radius, spacing } from '@hnba/design-tokens'
import { Icon, TextInput } from '@hnba/react-ui'
import type { CSSProperties } from 'react'

interface BuscadorProps {
    valor: string
    onCambiar: (valor: string) => void
    etiqueta: string
    placeholder: string
    ancho?: number
}

// TextInput no dibuja borde propio (lo pone FieldInput, que exige etiqueta visible), asi que aqui se enmarca
const estiloMarco = (ancho: number): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    width: ancho,
    maxWidth: '100%',
    paddingLeft: spacing.md,
    border: `1px solid ${colors.brand.gray[400]}`,
    borderRadius: radius.sm,
    background: colors.global.white,
    color: colors.brand.gray[700],
})

export const Buscador = ({ valor, onCambiar, etiqueta, placeholder, ancho = 320 }: BuscadorProps) => (
    <div style={estiloMarco(ancho)}>
        <Icon name="search" size={18} />
        <TextInput
            type="search"
            aria-label={etiqueta}
            autoComplete="off"
            value={valor}
            onChange={onCambiar}
            placeholder={placeholder}
        />
    </div>
)
