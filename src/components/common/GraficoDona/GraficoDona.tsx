import { colors } from '@hnba/design-tokens'

export interface SegmentoDona {
    nombre: string
    color: string
    valor: number
}

interface GraficoDonaProps {
    // Lo que anuncia el lector de pantalla para el grafico completo
    titulo: string
    segmentos: SegmentoDona[]
    // Numero grande y texto chico en el centro (por ejemplo, el total y "abiertos")
    centro: { valor: string; texto: string }
    // Lado en px
    tamano?: number
}

const RADIO = 40
const GROSOR = 14
const CIRCUNFERENCIA = 2 * Math.PI * RADIO
// Un poco de aire entre tramos para que se distingan colores parecidos
const SEPARACION = 1.5

// Dona en SVG con los colores de los tokens. Excepcion aprobada el 19/11: la libreria no trae graficos.
// Cada tramo es el mismo circulo con un trazo punteado: dasharray dibuja su largo y dashoffset lo corre a su lugar
export const GraficoDona = ({ titulo, segmentos, centro, tamano = 168 }: GraficoDonaProps) => {
    const total = segmentos.reduce((suma, segmento) => suma + segmento.valor, 0)
    const conValor = segmentos.filter((segmento) => segmento.valor > 0)
    const separacion = conValor.length > 1 ? SEPARACION : 0

    const largoDe = (valor: number) => (valor / total) * CIRCUNFERENCIA
    // Cada tramo empieza donde terminan los anteriores
    const tramos = conValor.map((segmento, i) => ({
        ...segmento,
        largo: Math.max(0, largoDe(segmento.valor) - separacion),
        inicio: conValor.slice(0, i).reduce((suma, anterior) => suma + largoDe(anterior.valor), 0),
    }))

    return (
        <svg
            viewBox="0 0 100 100"
            width={tamano}
            height={tamano}
            role="img"
            aria-label={`${titulo}: ${segmentos.map((s) => `${s.valor} ${s.nombre.toLowerCase()}`).join(', ')}`}
            style={{ flexShrink: 0 }}
        >
            <circle cx={50} cy={50} r={RADIO} fill="none" stroke={colors.brand.gray[100]} strokeWidth={GROSOR} />
            {tramos.map((tramo) => (
                <circle
                    key={tramo.nombre}
                    cx={50}
                    cy={50}
                    r={RADIO}
                    fill="none"
                    stroke={tramo.color}
                    strokeWidth={GROSOR}
                    strokeDasharray={`${tramo.largo} ${CIRCUNFERENCIA - tramo.largo}`}
                    strokeDashoffset={-tramo.inicio}
                    // El primer tramo arranca arriba (a las 12) y sigue en el sentido del reloj
                    transform="rotate(-90 50 50)"
                >
                    <title>{`${tramo.nombre}: ${tramo.valor} de ${total}`}</title>
                </circle>
            ))}
            <text x={50} y={50} textAnchor="middle" fontSize={20} fontWeight={700} fill={colors.brand.gray[900]}>
                {centro.valor}
            </text>
            <text x={50} y={63} textAnchor="middle" fontSize={8} fill={colors.brand.gray[700]}>
                {centro.texto}
            </text>
        </svg>
    )
}
