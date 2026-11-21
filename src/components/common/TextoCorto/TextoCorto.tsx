import { Tooltip } from '@hnba/react-ui'
import { useEffect, useRef, useState } from 'react'

interface TextoCortoProps {
    texto: string | null | undefined
    // Ancho maximo en px; el texto que no cabe se corta con puntos suspensivos
    ancho?: number
}

// Texto de una celda en una sola linea: si no cabe se corta con puntos suspensivos, la fila no crece y, al pasar el
// cursor (o enfocar con el teclado), el texto completo aparece arriba. Sin texto muestra "—"
export const TextoCorto = ({ texto, ancho = 260 }: TextoCortoProps) => {
    const referencia = useRef<HTMLSpanElement>(null)
    const [cortado, setCortado] = useState(false)

    // El tooltip solo se activa si el texto esta cortado; se vuelve a medir cuando cambia el ancho de la celda
    useEffect(() => {
        const elemento = referencia.current
        if (!elemento) {
            return
        }
        const medir = () => setCortado(elemento.scrollWidth > elemento.clientWidth)
        medir()
        const observador = new ResizeObserver(medir)
        observador.observe(elemento)
        return () => observador.disconnect()
    }, [texto])

    if (!texto) {
        return <>—</>
    }

    return (
        <Tooltip content={texto} position="top" disabled={!cortado}>
            <span
                ref={referencia}
                tabIndex={cortado ? 0 : undefined}
                style={{
                    display: 'block',
                    maxWidth: ancho,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {texto}
            </span>
        </Tooltip>
    )
}
