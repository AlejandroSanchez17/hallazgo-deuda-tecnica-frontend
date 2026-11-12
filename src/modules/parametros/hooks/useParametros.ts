import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { listarParametros } from '../api'
import type { ParametroResponse } from '../types'

interface Resultado {
    parametros: ParametroResponse[]
    error: ErrorApi | null
}

export const useParametros = () => {
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        listarParametros()
            .then((parametros) => {
                if (vigente) {
                    setResultado({ parametros, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({ parametros: [], error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    return {
        parametros: resultado?.parametros ?? [],
        cargando: resultado === null,
        error: resultado?.error ?? null,
        recargar,
    }
}
