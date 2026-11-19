import { useFormulario } from '../../../hooks/useFormulario'
import { planesApi } from '../apiPlan'
import { hoyApi } from '../fechas'
import type { ElementoDetalleResponse } from '../types'
import type { PlanFormulario, PlanResponse } from '../typesPlan'
import { useGuardar } from './useGuardar'

const aFecha = (valor: string) => (valor === '' ? null : valor)

// Crear (plan en null) o editar el plan vigente en elaboracion. El backend valida todo (400 y 422 con su campo)
export const usePlanForm = (ficha: ElementoDetalleResponse, plan: PlanResponse | null, onGuardado: () => void) => {
    const { formulario, asignar, cambiar } = useFormulario<PlanFormulario>({
        objetivo: plan?.objetivo ?? '',
        estrategia: plan?.estrategia ?? '',
        fechaInicio: plan?.fechaInicio ?? hoyApi(),
        fechaCompromiso: plan?.fechaCompromiso ?? '',
        requiereEvidencia: plan?.requiereEvidencia ?? true,
    })
    const { guardar, errores, guardando } = useGuardar(onGuardado)

    const enviar = () => {
        const solicitud = {
            objetivo: formulario.objetivo.trim(),
            estrategia: formulario.estrategia.trim(),
            fechaInicio: aFecha(formulario.fechaInicio),
            fechaCompromiso: aFecha(formulario.fechaCompromiso),
            requiereEvidencia: formulario.requiereEvidencia,
        }
        void guardar(() => (plan ? planesApi.actualizar(plan.id, solicitud) : planesApi.crear(ficha.id, solicitud)))
    }

    return { formulario, asignar, cambiar, errores, guardando, enviar }
}
