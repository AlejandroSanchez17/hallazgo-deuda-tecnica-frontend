import { colors, spacing } from '@hnba/design-tokens'
import type { CSSProperties } from 'react'

// Estilos de disposicion (flex y separaciones) con los tokens del design system.
// La libreria no trae componentes de layout, asi que se aplican con la prop style.

export const columna = (separacion: number = spacing.md): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: separacion,
})

export const fila = (separacion: number = spacing.md): CSSProperties => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: separacion,
})

export const filaEntreExtremos: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
}

export const textoSecundario: CSSProperties = { color: colors.brand.gray[700], margin: 0 }

export const centrado: CSSProperties = { textAlign: 'center', maxWidth: 448, margin: '0 auto', padding: '64px 0' }
