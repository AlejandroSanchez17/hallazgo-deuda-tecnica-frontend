import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { combosApi, elementosApi } from '../api'
import { planesApi } from '../apiPlan'
import type { ElementoDetalleResponse } from '../types'
import type { PlanResponse } from '../typesPlan'

interface Datos {
    clave: string
    ficha: ElementoDetalleResponse | null
    plan: PlanResponse | null
    // undefined: no se pidio (solo hace falta con alcance PROPIO) o no se pudo leer
    liderDelEquipo: number | null | undefined
    error: ErrorApi | null
}

// Ficha del elemento y el plan donde esta la tarea: el vigente, o la version que se indique con planId
// (la tarea de una version anterior tiene otro id que la de la vigente). No hay un endpoint para pedir una sola tarea.
// Con conLiderDelEquipo tambien pide el equipo, para saber si el usuario es su lider vigente (con alcance PROPIO el
// lider registra el avance de cualquier tarea del plan)
export const useTareaDetalle = (elementoId: number, planId: number | null, conLiderDelEquipo: boolean) => {
    const [datos, setDatos] = useState<Datos | null>(null)
    // Sube con cada recarga: las secciones que piden sus propios datos (evidencias, avances) se vuelven a montar
    const [recarga, setRecarga] = useState(0)
    const clave = `${elementoId}-${planId ?? 'vigente'}`

    useEffect(() => {
        let vigente = true
        Promise.all([
            elementosApi.obtener(elementoId),
            planId === null ? planesApi.vigente(elementoId) : planesApi.obtener(planId),
        ])
            .then(async ([ficha, plan]) => {
                const liderDelEquipo = conLiderDelEquipo
                    ? await combosApi
                          .equipo(ficha.equipoId)
                          .then((equipo) => equipo.liderId)
                          .catch(() => undefined)
                    : undefined
                if (vigente) {
                    setDatos({ clave, ficha, plan, liderDelEquipo, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setDatos({ clave, ficha: null, plan: null, liderDelEquipo: undefined, error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [clave, elementoId, planId, conLiderDelEquipo, recarga])

    const recargar = useCallback(() => setRecarga((anterior) => anterior + 1), [])

    const actual = datos?.clave === clave ? datos : null

    return {
        ficha: actual?.ficha ?? null,
        plan: actual?.plan ?? null,
        liderDelEquipo: actual?.liderDelEquipo,
        // Al recargar se sigue mostrando lo actual; solo otra tarea muestra "Cargando"
        cargando: actual === null,
        error: actual?.error ?? null,
        recarga,
        recargar,
    }
}
