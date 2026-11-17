import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'

interface Resultado<T> {
    registros: T[]
    error: ErrorApi | null
}

// Lista completa sin filtro de estado: los filtros se aplican en el navegador. listar debe ser estable
export const useLista = <T>(listar: () => Promise<T[]>) => {
    const [resultado, setResultado] = useState<Resultado<T> | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        listar()
            .then((registros) => {
                if (vigente) {
                    setResultado({ registros, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({ registros: [], error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [listar, version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    // Al recargar se siguen mostrando las filas actuales
    return {
        registros: resultado?.registros ?? [],
        cargando: resultado === null,
        error: resultado?.error ?? null,
        recargar,
    }
}
