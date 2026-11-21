import { colors, spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { fila, textoSecundario } from '../../../styles/disposicion'

export interface SerieGrafico {
    nombre: string
    color: string
    valores: number[]
}

interface GraficoColumnasProps {
    // Lo que anuncia el lector de pantalla para el grafico completo
    titulo: string
    // Una por grupo (por ejemplo, los meses); etiquetasLargas va en la tabla oculta y en el texto de cada barra
    etiquetas: string[]
    etiquetasLargas?: string[]
    series: SerieGrafico[]
    // Encabezado de la primera columna de la tabla oculta
    nombreGrupo?: string
    // Linea horizontal punteada (por ejemplo, el promedio general) con su texto
    referencia?: { valor: number; texto: string }
    // Ancho del dibujo (el SVG se escala al de su tarjeta): uno menor engorda texto y barras en tarjetas angostas
    ancho?: number
}

const ANCHO_POR_DEFECTO = 720
const ALTO = 220
const MARGEN = { arriba: 12, derecha: 8, abajo: 28, izquierda: 32 }
const LINEAS = 4

// Solo para lectores de pantalla: la tabla con los mismos numeros del grafico
const oculto: CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
}

// Escala de 0 a un tope redondo (multiplo de 4) para que las lineas guia caigan en numeros enteros
const topeDe = (maximo: number) => Math.max(LINEAS, Math.ceil(maximo / LINEAS) * LINEAS)

// Columnas agrupadas en SVG con los colores de los tokens. Excepcion aprobada el 19/11: la libreria no trae graficos
export const GraficoColumnas = ({
    titulo,
    etiquetas,
    etiquetasLargas = etiquetas,
    series,
    nombreGrupo = 'Período',
    referencia,
    ancho = ANCHO_POR_DEFECTO,
}: GraficoColumnasProps) => {
    const tope = topeDe(Math.max(0, referencia?.valor ?? 0, ...series.flatMap((serie) => serie.valores)))
    const anchoUtil = ancho - MARGEN.izquierda - MARGEN.derecha
    const altoUtil = ALTO - MARGEN.arriba - MARGEN.abajo
    const anchoGrupo = anchoUtil / Math.max(1, etiquetas.length)
    const anchoBarra = (anchoGrupo * 0.7) / Math.max(1, series.length)
    const y = (valor: number) => MARGEN.arriba + altoUtil - (valor / tope) * altoUtil

    return (
        <figure style={{ margin: 0, position: 'relative' }}>
            <div style={{ ...fila(spacing.md), marginBottom: spacing.sm }}>
                {series.map((serie) => (
                    <span key={serie.nombre} style={fila(spacing.xs)}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: serie.color }} />
                        <Text variant="body-regular-small" as="span">
                            {serie.nombre}
                        </Text>
                    </span>
                ))}
            </div>
            <svg viewBox={`0 0 ${ancho} ${ALTO}`} width="100%" role="img" aria-label={titulo}>
                {Array.from({ length: LINEAS + 1 }, (_, i) => (tope / LINEAS) * i).map((valor) => (
                    <g key={valor}>
                        <line
                            x1={MARGEN.izquierda}
                            x2={ancho - MARGEN.derecha}
                            y1={y(valor)}
                            y2={y(valor)}
                            stroke={colors.brand.gray[valor === 0 ? 400 : 100]}
                        />
                        <text
                            x={MARGEN.izquierda - 6}
                            y={y(valor) + 4}
                            textAnchor="end"
                            fontSize={11}
                            fill={colors.brand.gray[700]}
                        >
                            {valor}
                        </text>
                    </g>
                ))}
                {etiquetas.map((etiqueta, grupo) => {
                    const inicio = MARGEN.izquierda + anchoGrupo * grupo + anchoGrupo * 0.15
                    return (
                        <g key={etiquetasLargas[grupo]}>
                            {series.map((serie, i) => (
                                <rect
                                    key={serie.nombre}
                                    x={inicio + anchoBarra * i}
                                    y={y(serie.valores[grupo])}
                                    width={Math.max(1, anchoBarra - 2)}
                                    height={y(0) - y(serie.valores[grupo])}
                                    rx={2}
                                    fill={serie.color}
                                >
                                    <title>{`${etiquetasLargas[grupo]}: ${serie.valores[grupo]} ${serie.nombre.toLowerCase()}`}</title>
                                </rect>
                            ))}
                            <text
                                x={inicio + anchoGrupo * 0.35}
                                y={ALTO - 8}
                                textAnchor="middle"
                                fontSize={11}
                                fill={colors.brand.gray[700]}
                            >
                                {etiqueta}
                            </text>
                        </g>
                    )
                })}
                {referencia && (
                    <g>
                        <line
                            x1={MARGEN.izquierda}
                            x2={ancho - MARGEN.derecha}
                            y1={y(referencia.valor)}
                            y2={y(referencia.valor)}
                            stroke={colors.brand.gray[900]}
                            strokeDasharray="5 4"
                        />
                        <text
                            x={ancho - MARGEN.derecha}
                            y={y(referencia.valor) - 5}
                            textAnchor="end"
                            fontSize={11}
                            fontWeight={700}
                            fill={colors.brand.gray[900]}
                            // Contorno blanco para que se lea aunque pase sobre una barra
                            stroke="white"
                            strokeWidth={3}
                            paintOrder="stroke"
                        >
                            {referencia.texto}
                        </text>
                    </g>
                )}
            </svg>
            <Text variant="body-regular-small" as="figcaption" style={textoSecundario}>
                Pase el puntero sobre una barra para ver su valor.
            </Text>
            <div style={oculto}>
                <table>
                    <caption>{titulo}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{nombreGrupo}</th>
                            {series.map((serie) => (
                                <th key={serie.nombre} scope="col">
                                    {serie.nombre}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {etiquetasLargas.map((etiqueta, grupo) => (
                            <tr key={etiqueta}>
                                <th scope="row">{etiqueta}</th>
                                {series.map((serie) => (
                                    <td key={serie.nombre}>{serie.valores[grupo]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </figure>
    )
}
