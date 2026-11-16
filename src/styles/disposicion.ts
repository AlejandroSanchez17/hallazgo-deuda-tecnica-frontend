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

// Formularios de 4 campos o mas en dos columnas, como el ejemplo de FormModal de la libreria (panel derecho de
// 560 px). Si el panel es angosto (por ejemplo, en un celular) las columnas bajan a una. Una regla de globals.css
// impide que un campo se salga de su columna
export const rejillaFormulario: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
    gap: spacing.md,
    alignItems: 'start',
}

// Un campo de la rejilla que ocupa las dos columnas (descripciones, ayudas largas)
export const anchoCompleto: CSSProperties = { gridColumn: '1 / -1' }

export const textoSecundario: CSSProperties = { color: colors.brand.gray[700], margin: 0 }

export const centrado: CSSProperties = { textAlign: 'center', maxWidth: 448, margin: '0 auto', padding: '64px 0' }
