import { useEffect, useState } from 'react'

// Mismo corte que usa el NavBar de la libreria (collapseAt = 1024): por debajo cambia a modo compacto
export const ANCHO_COMPACTO = 1024

const consulta = `(max-width: ${ANCHO_COMPACTO - 1}px)`

export const useEsCompacto = (): boolean => {
    const [esCompacto, setEsCompacto] = useState(() => window.matchMedia(consulta).matches)

    useEffect(() => {
        const medios = window.matchMedia(consulta)
        const actualizar = () => setEsCompacto(medios.matches)
        medios.addEventListener('change', actualizar)
        return () => medios.removeEventListener('change', actualizar)
    }, [])

    return esCompacto
}
