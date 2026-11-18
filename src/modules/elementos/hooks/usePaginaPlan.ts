import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso, type ErrorApi } from '../../../services/api'
import { combosApi, elementosApi } from '../api'
import { planesApi } from '../apiPlan'
import type { ElementoDetalleResponse } from '../types'
import type { PlanResponse, PlanResumen } from '../typesPlan'

interface Datos {
    id: number
    ficha: ElementoDetalleResponse | null
    vigente: PlanResponse | null
    versiones: PlanResumen[]
    // undefined: no se pidio (solo hace falta con alcance PROPIO) o no se pudo leer
    liderDelEquipo: number | null | undefined
    error: ErrorApi | null
}

// Una version anterior elegida en el combo; plan en null mientras se pide
interface Anterior {
    id: number
    plan: PlanResponse | null
}

// Ficha del elemento, plan vigente y versiones. Con conLiderDelEquipo tambien pide el equipo, para saber si el
// usuario es su lider vigente (con alcance PROPIO solo el arma el plan)
export const usePaginaPlan = (elementoId: number, conLiderDelEquipo: boolean) => {
    const [datos, setDatos] = useState<Datos | null>(null)
    const [anterior, setAnterior] = useState<Anterior | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        Promise.all([elementosApi.obtener(elementoId), planesApi.vigente(elementoId), planesApi.versiones(elementoId)])
            .then(async ([ficha, plan, versiones]) => {
                const liderDelEquipo = conLiderDelEquipo
                    ? await combosApi
                          .equipo(ficha.equipoId)
                          .then((equipo) => equipo.liderId)
                          .catch(() => undefined)
                    : undefined
                if (vigente) {
                    setDatos({ id: elementoId, ficha, vigente: plan, versiones, liderDelEquipo, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setDatos({
                        id: elementoId,
                        ficha: null,
                        vigente: null,
                        versiones: [],
                        liderDelEquipo: undefined,
                        error: aErrorApi(error),
                    })
                }
            })
        return () => {
            vigente = false
        }
    }, [elementoId, conLiderDelEquipo, version])

    // Las acciones solo se hacen sobre el plan vigente: al recargar se vuelve a el
    const recargar = useCallback(() => {
        setAnterior(null)
        setVersion((previa) => previa + 1)
    }, [])

    const delActual = datos?.id === elementoId ? datos : null

    const elegirVersion = (planId: number) => {
        if (planId === delActual?.vigente?.id) {
            setAnterior(null)
            return
        }
        setAnterior({ id: planId, plan: null })
        planesApi
            .obtener(planId)
            .then((plan) => setAnterior((actual) => (actual?.id === planId ? { id: planId, plan } : actual)))
            .catch((error: unknown) => {
                avisarSiNoSeAviso(aErrorApi(error))
                setAnterior(null)
            })
    }

    return {
        ficha: delActual?.ficha ?? null,
        // El que se muestra: el vigente o la version anterior elegida
        plan: anterior ? anterior.plan : (delActual?.vigente ?? null),
        planElegidoId: anterior?.id ?? delActual?.vigente?.id ?? null,
        versiones: delActual?.versiones ?? [],
        liderDelEquipo: delActual?.liderDelEquipo,
        // Al recargar se sigue mostrando lo actual; solo otro elemento muestra "Cargando"
        cargando: delActual === null,
        cargandoVersion: anterior !== null && anterior.plan === null,
        error: delActual?.error ?? null,
        recargar,
        elegirVersion,
    }
}
