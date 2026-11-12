import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import type { FiltroEstado } from '../types'

const activoPorFiltro: Record<FiltroEstado, boolean | undefined> = {
    activos: true,
    inactivos: false,
    todos: undefined,
}

interface Resultado<T> {
    filtro: FiltroEstado
    registros: T[]
    error: ErrorApi | null
}

// listar debe ser una funcion estable (las de api.ts lo son)
export const useListaCatalogo = <T>(listar: (activo?: boolean) => Promise<T[]>, filtro: FiltroEstado) => {
    const [resultado, setResultado] = useState<Resultado<T> | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        listar(activoPorFiltro[filtro])
            .then((registros) => {
                if (vigente) {
                    setResultado({ filtro, registros, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({ filtro, registros: [], error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [listar, filtro, version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    // Al recargar se siguen mostrando las filas actuales; solo un filtro nuevo muestra "Cargando"
    const delFiltroActual = resultado?.filtro === filtro ? resultado : null
    return {
        registros: delFiltroActual?.registros ?? [],
        cargando: delFiltroActual === null,
        error: delFiltroActual?.error ?? null,
        recargar,
    }
}
