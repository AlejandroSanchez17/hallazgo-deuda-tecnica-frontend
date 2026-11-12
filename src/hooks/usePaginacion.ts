import { useState } from 'react'

export const TAMANOS_PAGINA = [10, 25, 50]

// claveReinicio cambia con la busqueda o el filtro; al cambiar se vuelve a la primera pagina
export const usePaginacion = <T>(filas: T[], claveReinicio: string) => {
    const [tamano, setTamano] = useState(TAMANOS_PAGINA[0])
    const [pagina, setPagina] = useState(1)
    const [claveAnterior, setClaveAnterior] = useState(claveReinicio)

    if (claveAnterior !== claveReinicio) {
        setClaveAnterior(claveReinicio)
        setPagina(1)
    }

    const totalPaginas = Math.max(1, Math.ceil(filas.length / tamano))
    // Si se desactiva la ultima fila de la ultima pagina, se muestra la anterior
    const paginaActual = Math.min(pagina, totalPaginas)
    const inicio = (paginaActual - 1) * tamano

    const cambiarTamano = (nuevoTamano: number) => {
        setTamano(nuevoTamano)
        setPagina(1)
    }

    return {
        filasPagina: filas.slice(inicio, inicio + tamano),
        pagina: paginaActual,
        totalPaginas,
        total: filas.length,
        tamano,
        irAPagina: setPagina,
        cambiarTamano,
    }
}
