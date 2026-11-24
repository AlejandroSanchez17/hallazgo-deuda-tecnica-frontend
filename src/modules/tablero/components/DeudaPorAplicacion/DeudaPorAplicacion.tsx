import { spacing } from '@hnba/design-tokens'
import { ProgressBar, Text } from '@hnba/react-ui'
import { useLayoutEffect, useRef, useState } from 'react'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { contar, formatearHoras } from '../../textos'
import type { DeudaAplicacion } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface DeudaPorAplicacionProps {
    filas: DeudaAplicacion[]
    // Del backend: cuenta cada deuda una sola vez, a diferencia de la suma de las filas
    totalHoras: number
    elementos: number
    // Con true la tarjeta llena el alto que le dejan las de al lado (su contenedor debe ser position: relative) y
    // muestra tantas aplicaciones como caben; con false crece con su contenido y muestra CAPACIDAD_FIJA
    ajustarAlto?: boolean
}

// Filas (aplicaciones y, si sobran, "Otras") que se muestran cuando el alto no se mide
const CAPACIDAD_FIJA = 6
// Aunque la tarjeta sea baja se muestran al menos estas filas
const CAPACIDAD_MINIMA = 3
// Separacion entre filas; igual a la de la columna que las contiene
const SEPARACION = spacing.sm

interface Barra {
    clave: string
    nombre: string
    horas: number
    elementos: number
}

const nombreDe = (fila: DeudaAplicacion) => fila.aplicacion ?? 'Sin aplicación'

// Las que mas horas tienen, hasta "capacidad" filas; si no caben todas, la ultima junta el resto en "Otras"
const barrasDe = (filas: DeudaAplicacion[], capacidad: number): Barra[] => {
    const ordenadas = [...filas].sort((a, b) => b.horas - a.horas)
    // Si caben todas no hay "Otras"; "Otras (1)" nunca se da porque no ahorraria nada
    const visibles = ordenadas.length <= capacidad ? ordenadas.length : capacidad - 1
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
export const DeudaPorAplicacion = ({ filas, totalHoras, elementos, ajustarAlto = false }: DeudaPorAplicacionProps) => {
    const zonaLista = useRef<HTMLDivElement>(null)
    const [capacidadMedida, setCapacidadMedida] = useState(CAPACIDAD_FIJA)

    // Cuantas filas caben en el alto que queda bajo la cifra total; se vuelve a medir si cambia el alto de la tarjeta
    // (por ejemplo, al crecer la columna de al lado). El alto de esta zona no depende de las filas que se dibujan
    useLayoutEffect(() => {
        const zona = zonaLista.current
        if (!ajustarAlto || !zona) {
            return
        }
        const medir = () => {
            const fila = zona.querySelector<HTMLElement>('[data-fila-aplicacion]')
            if (fila) {
                const paso = fila.offsetHeight + SEPARACION
                setCapacidadMedida(Math.max(CAPACIDAD_MINIMA, Math.floor((zona.clientHeight + SEPARACION) / paso)))
            }
        }
        medir()
        const observador = new ResizeObserver(medir)
        observador.observe(zona)
        return () => observador.disconnect()
    }, [ajustarAlto, filas.length])

    const barras = barrasDe(filas, ajustarAlto ? capacidadMedida : CAPACIDAD_FIJA)
    const maximo = Math.max(0, ...barras.map((barra) => barra.horas))

    return (
        <Bloque
            titulo="Deuda técnica pendiente"
            nota="Una deuda con varias aplicaciones cuenta completa en cada una, así que la suma de las filas puede pasar del total."
            llenaAlto={ajustarAlto}
        >
            <div style={{ ...columna(spacing.md), ...(ajustarAlto ? { flex: 1, minHeight: 0 } : {}) }}>
                <div style={columna(spacing.xs)}>
                    <Text variant="h2" as="p" style={{ margin: 0 }}>
                        {formatearHoras(totalHoras)}
                    </Text>
                    <Text variant="body-regular-small" as="p" style={textoSecundario}>
                        {contar(
                            elementos,
                            'elemento de deuda sin cerrar ni anular',
                            'elementos de deuda sin cerrar ni anular',
                        )}
                    </Text>
                </div>
                {barras.length === 0 ? (
                    <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                        No hay deuda técnica pendiente.
                    </Text>
                ) : (
                    <div
                        ref={zonaLista}
                        style={{
                            ...columna(SEPARACION),
                            ...(ajustarAlto ? { flex: 1, minHeight: 0, overflow: 'hidden' } : {}),
                        }}
                    >
                        {barras.map((barra) => (
                            <div key={barra.clave} data-fila-aplicacion style={columna(4)}>
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
