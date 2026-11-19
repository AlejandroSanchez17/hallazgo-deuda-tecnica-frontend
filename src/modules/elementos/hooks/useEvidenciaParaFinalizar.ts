import { useCallback, useEffect, useState } from 'react'
import { evidenciasApi } from '../apiEvidencias'
import { planesApi } from '../apiPlan'

interface Revision {
    tareaId: number
    falta: boolean
}

// RF-TAR-05: si el plan exige evidencia y la tarea no tiene ninguna vigente, el avance a Finalizada da 422. Se revisa
// al abrir la ventana para avisar antes. Desde Mis tareas no se conoce el plan: requiereEvidencia llega undefined y
// se pide. Si algo falla no se avisa y decide el backend
export const useEvidenciaParaFinalizar = (
    elementoId: number,
    tarea: { id: number; planId: number },
    requiereEvidencia?: boolean,
) => {
    const [revision, setRevision] = useState<Revision | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        const requiere =
            requiereEvidencia ??
            planesApi
                .obtener(tarea.planId)
                .then((plan) => plan.requiereEvidencia)
                .catch(() => false)
        void Promise.resolve(requiere)
            .then(async (exige) => {
                if (!exige) {
                    return false
                }
                const evidencias = await evidenciasApi.listar(elementoId, tarea.id)
                return !evidencias.some((evidencia) => evidencia.estado === 'VIGENTE')
            })
            .catch(() => false)
            .then((falta) => vigente && setRevision({ tareaId: tarea.id, falta }))
        return () => {
            vigente = false
        }
    }, [elementoId, tarea.id, tarea.planId, requiereEvidencia, version])

    return {
        faltaEvidencia: revision?.tareaId === tarea.id && revision.falta,
        revisarDeNuevo: useCallback(() => setVersion((previa) => previa + 1), []),
    }
}
