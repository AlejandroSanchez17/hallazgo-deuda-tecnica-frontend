import { spacing } from '@hnba/design-tokens'
import { ProgressBar, Text } from '@hnba/react-ui'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { contar, formatearHoras } from '../../textos'
import type { DeudaAplicacion } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface DeudaPorAplicacionProps {
    filas: DeudaAplicacion[]
    // Del backend: cuenta cada deuda una sola vez, a diferencia de la suma de las filas
    totalHoras: number
    elementos: number
}

// Las que mas horas tienen; el resto se junta en "Otras"
const MAXIMO_VISIBLES = 5

interface Barra {
    clave: string
    nombre: string
    horas: number
    elementos: number
}

const nombreDe = (fila: DeudaAplicacion) => fila.aplicacion ?? 'Sin aplicación'

const barrasDe = (filas: DeudaAplicacion[]): Barra[] => {
    const ordenadas = [...filas].sort((a, b) => b.horas - a.horas)
    // "Otras (1)" no ahorra nada: si sobra una sola, se muestra con su nombre
    const visibles = ordenadas.length === MAXIMO_VISIBLES + 1 ? MAXIMO_VISIBLES + 1 : MAXIMO_VISIBLES
    const barras = ordenadas.slice(0, visibles).map((fila) => ({
        clave: String(fila.aplicacionId ?? 'sin-aplicacion'),
        nombre: nombreDe(fila),
        horas: fila.horas,
        elementos: fila.elementos,
    }))
    const resto = ordenadas.slice(visibles)
    if (resto.length === 0) {
        return barras
    }
    return [
        ...barras,
        {
            clave: 'otras',
            nombre: `Otras (${resto.length})`,
            horas: resto.reduce((suma, fila) => suma + fila.horas, 0),
            elementos: resto.reduce((suma, fila) => suma + fila.elementos, 0),
        },
    ]
}

// La cifra total arriba y el ranking de aplicaciones debajo, sin tabla
export const DeudaPorAplicacion = ({ filas, totalHoras, elementos }: DeudaPorAplicacionProps) => {
    const barras = barrasDe(filas)
    const maximo = Math.max(0, ...barras.map((barra) => barra.horas))

    return (
        <Bloque
            titulo="Deuda técnica pendiente"
            nota="Una deuda con varias aplicaciones cuenta completa en cada una, así que la suma de las filas puede pasar del total."
        >
            <div style={columna(spacing.md)}>
                <div style={columna(spacing.xs)}>
                    <Text variant="h2" as="p" style={{ margin: 0 }}>
                        {formatearHoras(totalHoras)}
                    </Text>
                    <Text variant="body-regular-small" as="p" style={textoSecundario}>
                        {contar(elementos, 'elemento de deuda sin cerrar ni anular', 'elementos de deuda sin cerrar ni anular')}
                    </Text>
                </div>
                {barras.length === 0 ? (
                    <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                        No hay deuda técnica pendiente.
                    </Text>
                ) : (
                    <div style={columna(spacing.sm)}>
                        {barras.map((barra) => (
                            <div key={barra.clave} style={columna(4)}>
                                <div style={{ ...filaEntreExtremos, alignItems: 'baseline', flexWrap: 'nowrap' }}>
                                    <Text variant="body-bold-medium" as="span">
                                        {barra.nombre}
                                    </Text>
                                    <Text variant="body-bold-medium" as="span" style={{ whiteSpace: 'nowrap' }}>
                                        {formatearHoras(barra.horas)}
                                    </Text>
                                </div>
                                <ProgressBar
                                    value={maximo === 0 ? 0 : (barra.horas / maximo) * 100}
                                    height={8}
                                    aria-label={`${barra.nombre}: ${formatearHoras(barra.horas)}`}
                                />
                                <Text variant="body-regular-small" as="span" style={textoSecundario}>
                                    {contar(barra.elementos, 'elemento', 'elementos')}
                                </Text>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Bloque>
    )
}
