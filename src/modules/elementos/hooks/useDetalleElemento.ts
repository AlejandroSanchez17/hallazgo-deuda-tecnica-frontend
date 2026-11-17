import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { combosApi, elementosApi } from '../api'
import type { CambioEstadoResponse, ElementoDetalleResponse, ReasignacionResponse } from '../types'

interface Resultado {
    id: number
    ficha: ElementoDetalleResponse | null
    reasignaciones: ReasignacionResponse[]
    estados: CambioEstadoResponse[]
    // undefined: no se pidio (solo hace falta con alcance PROPIO) o no se pudo leer
    liderDelEquipo: number | null | undefined
    error: ErrorApi | null
}

// Ficha del elemento con sus dos historiales. Con conLiderDelEquipo tambien pide el equipo, para saber si el
// usuario es su lider vigente (con alcance PROPIO solo el reasigna)
export const useDetalleElemento = (id: number, conLiderDelEquipo: boolean) => {
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        Promise.all([elementosApi.obtener(id), elementosApi.reasignaciones(id), elementosApi.estados(id)])
            .then(async ([ficha, reasignaciones, estados]) => {
                const liderDelEquipo = conLiderDelEquipo
                    ? await combosApi
                          .equipo(ficha.equipoId)
                          .then((equipo) => equipo.liderId)
                          .catch(() => undefined)
                    : undefined
                if (vigente) {
                    setResultado({ id, ficha, reasignaciones, estados, liderDelEquipo, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({
                        id,
                        ficha: null,
                        reasignaciones: [],
                        estados: [],
                        liderDelEquipo: undefined,
                        error: aErrorApi(error),
                    })
                }
            })
        return () => {
            vigente = false
        }
    }, [id, conLiderDelEquipo, version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    // Al recargar se sigue mostrando el elemento actual; solo otro elemento muestra "Cargando"
    const delActual = resultado?.id === id ? resultado : null
    return {
        ficha: delActual?.ficha ?? null,
        reasignaciones: delActual?.reasignaciones ?? [],
        estados: delActual?.estados ?? [],
        liderDelEquipo: delActual?.liderDelEquipo,
        cargando: delActual === null,
        error: delActual?.error ?? null,
        recargar,
    }
}
