import { spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { CSSProperties, ReactNode } from 'react'
import { columna, rejillaFormulario, textoSecundario } from '../../../../styles/disposicion'

// Piezas para mostrar datos en solo lectura: los datos cortos y los textos largos, sin cuadro ni lineas, con la
// etiqueta arriba y el valor abajo, y una rejilla que los acomoda. Las usa la pestana Datos del elemento. Las fichas de
// una fila tienen el mismo alto, asi que los valores quedan alineados

// Valor de 16 px (body large) y etiqueta de 14 px; el valor conserva los saltos de linea de los textos largos
const estiloValor: CSSProperties = { margin: 0, whiteSpace: 'pre-wrap' }

// Etiqueta arriba y valor abajo, sin cuadro ni linea
const estiloDato: CSSProperties = columna(spacing.xs)

const vacio = (valor: ReactNode) => (valor === null || valor === '' ? '—' : valor)

// Dato corto (categoria, fecha, talla…): su etiqueta y su valor
export const fichaDato = (etiqueta: string, valor: ReactNode) => (
    <div style={estiloDato}>
        <Text variant="label-semibold-medium" style={textoSecundario}>
            {etiqueta}
        </Text>
        {/* marginTop auto: en una fila los valores quedan a la misma altura aunque una etiqueta se parta en dos lineas */}
        <Text variant="body-regular-large" as="div" style={{ ...estiloValor, marginTop: 'auto' }}>
            {vacio(valor)}
        </Text>
    </div>
)

// Texto largo (causa, impacto, objetivo…): con el mismo estilo que un dato corto
export const fichaTexto = (etiqueta: string, valor: ReactNode) => (
    <div style={estiloDato}>
        <Text variant="label-semibold-medium" style={textoSecundario}>
            {etiqueta}
        </Text>
        <Text variant="body-regular-large" as="div" style={estiloValor}>
            {vacio(valor)}
        </Text>
    </div>
)

// Rejilla de a lo mas `columnas` columnas: en pantallas angostas los campos bajan a menos columnas
export const rejillaFichas = (columnas: number, contenido: ReactNode) => (
    <div
        style={{
            ...rejillaFormulario,
            // Las fichas de una fila tienen todas el mismo alto
            alignItems: 'stretch',
            gridTemplateColumns: `repeat(auto-fit, minmax(max(${columnas >= 5 ? 170 : 220}px, calc((100% - ${(columnas - 1) * spacing.md}px) / ${columnas})), 1fr))`,
        }}
    >
        {contenido}
    </div>
)
