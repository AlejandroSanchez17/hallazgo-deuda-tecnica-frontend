import { colors, spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { fila } from '../../../styles/disposicion'
import type { SerieGrafico } from '../GraficoColumnas/GraficoColumnas'

interface GraficoLineasProps {
    // Lo que anuncia el lector de pantalla para el grafico completo
    titulo: string
    // Una por punto (por ejemplo, los meses); etiquetasLargas va en la tabla oculta y en el texto de cada punto
    etiquetas: string[]
    etiquetasLargas?: string[]
    series: SerieGrafico[]
    // Encabezado de la primera columna de la tabla oculta
    nombreGrupo?: string
}

const ANCHO = 360
const ALTO = 220
const MARGEN = { arriba: 12, derecha: 12, abajo: 28, izquierda: 28 }
const LINEAS = 4
// Con muchos puntos las etiquetas se montan: se muestra una de cada dos
const MAXIMO_ETIQUETAS = 8

// Solo para lectores de pantalla: la tabla con los mismos numeros del grafico
const oculto: CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
}

const topeDe = (maximo: number) => Math.max(LINEAS, Math.ceil(maximo / LINEAS) * LINEAS)

// Lineas con puntos en SVG con los colores de los tokens. Excepcion aprobada el 19/11: la libreria no trae graficos
export const GraficoLineas = ({
    titulo,
    etiquetas,
    etiquetasLargas = etiquetas,
    series,
    nombreGrupo = 'Período',
}: GraficoLineasProps) => {
    const tope = topeDe(Math.max(0, ...series.flatMap((serie) => serie.valores)))
    const anchoUtil = ANCHO - MARGEN.izquierda - MARGEN.derecha
    const altoUtil = ALTO - MARGEN.arriba - MARGEN.abajo
    const paso = etiquetas.length > 1 ? anchoUtil / (etiquetas.length - 1) : 0
    const x = (indice: number) => MARGEN.izquierda + (etiquetas.length > 1 ? paso * indice : anchoUtil / 2)
    const y = (valor: number) => MARGEN.arriba + altoUtil - (valor / tope) * altoUtil
    const cadaCuantas = etiquetas.length > MAXIMO_ETIQUETAS ? 2 : 1

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
            <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width="100%" role="img" aria-label={titulo}>
                {Array.from({ length: LINEAS + 1 }, (_, i) => (tope / LINEAS) * i).map((valor) => (
                    <g key={valor}>
                        <line
                            x1={MARGEN.izquierda}
                            x2={ANCHO - MARGEN.derecha}
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
                {etiquetas.map((etiqueta, indice) =>
                    indice % cadaCuantas === 0 ? (
                        <text
                            key={etiquetasLargas[indice]}
                            x={x(indice)}
                            y={ALTO - 8}
                            textAnchor="middle"
                            fontSize={11}
                            fill={colors.brand.gray[700]}
                        >
                            {etiqueta}
                        </text>
                    ) : null,
                )}
                {series.map((serie) => (
                    <g key={serie.nombre}>
                        <polyline
                            fill="none"
                            stroke={serie.color}
                            strokeWidth={2.5}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            points={serie.valores.map((valor, indice) => `${x(indice)},${y(valor)}`).join(' ')}
                        />
                        {serie.valores.map((valor, indice) => (
                            <circle
                                key={etiquetasLargas[indice]}
                                cx={x(indice)}
                                cy={y(valor)}
                                r={3.5}
                                fill={serie.color}
                            >
                                <title>{`${etiquetasLargas[indice]}: ${valor} ${serie.nombre.toLowerCase()}`}</title>
                            </circle>
                        ))}
                    </g>
                ))}
            </svg>
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
                        {etiquetasLargas.map((etiqueta, indice) => (
                            <tr key={etiqueta}>
                                <th scope="row">{etiqueta}</th>
                                {series.map((serie) => (
                                    <td key={serie.nombre}>{serie.valores[indice]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </figure>
    )
}
