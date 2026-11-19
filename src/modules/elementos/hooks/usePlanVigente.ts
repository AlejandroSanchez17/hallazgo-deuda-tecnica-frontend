import { useCallback, useEffect, useState } from 'react'
import { usePermiso } from '../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../utils/constants/permisos'
import { planesApi } from '../apiPlan'
import type { PlanResponse } from '../typesPlan'

interface Leido {
    elementoId: number
    plan: PlanResponse | null
}

// Plan vigente con sus tareas, para saber en que destinos se puede subir una evidencia. Sin PLAN:LEER no se pide
export const usePlanVigente = (elementoId: number) => {
    const vePlan = usePermiso(PERMISOS.planLeer)
    const [leido, setLeido] = useState<Leido | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        if (!vePlan) {
            return
        }
        let vigente = true
        planesApi
            .vigente(elementoId)
            .then((plan) => vigente && setLeido({ elementoId, plan }))
            .catch(() => vigente && setLeido({ elementoId, plan: null }))
        return () => {
            vigente = false
        }
    }, [vePlan, elementoId, version])

    return {
        plan: leido?.elementoId === elementoId ? leido.plan : null,
        recargar: useCallback(() => setVersion((previa) => previa + 1), []),
    }
}
