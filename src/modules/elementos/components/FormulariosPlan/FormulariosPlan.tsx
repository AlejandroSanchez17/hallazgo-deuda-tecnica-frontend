import { planesApi } from '../../apiPlan'
import { avisoCancelacion, avisoDependencia } from '../../textosPlan'
import type { ElementoDetalleResponse } from '../../types'
import type { PlanResponse, TareaResponse } from '../../typesPlan'
import { AvanceForm } from '../AvanceForm/AvanceForm'
import { DetalleTarea } from '../DetalleTarea/DetalleTarea'
import { MotivoForm } from '../MotivoForm/MotivoForm'
import { PlanForm } from '../PlanForm/PlanForm'
import { TareaForm } from '../TareaForm/TareaForm'

export type FormularioPlan =
    | { tipo: 'plan' }
    | { tipo: 'ver'; tarea: TareaResponse }
    | { tipo: 'avance'; tarea: TareaResponse }
    | { tipo: 'tarea'; tarea: TareaResponse | null }
    | { tipo: 'cancelar'; tarea: TareaResponse }
    | { tipo: 'devolver' }
    | { tipo: 'version' }
    | null

interface FormulariosPlanProps {
    formulario: FormularioPlan
    ficha: ElementoDetalleResponse
    // El vigente; null solo al crear el plan
    plan: PlanResponse | null
    onCerrar: () => void
    onHecho: () => void
}

// El formulario abierto en la pagina del plan
export const FormulariosPlan = ({ formulario, ficha, plan, onCerrar, onHecho }: FormulariosPlanProps) => {
    if (formulario === null) {
        return null
    }
    if (formulario.tipo === 'plan') {
        return <PlanForm ficha={ficha} plan={plan} onCerrar={onCerrar} onGuardado={onHecho} />
    }
    if (!plan) {
        return null
    }
    switch (formulario.tipo) {
        case 'ver':
            return (
                <DetalleTarea
                    tarea={formulario.tarea}
                    problemas={plan.problemas.filter((problema) => problema.tareaId === formulario.tarea.id)}
                    onCerrar={onCerrar}
                />
            )
        case 'avance':
            return (
                <AvanceForm
                    tarea={formulario.tarea}
                    avisoDependencia={avisoDependencia(plan, formulario.tarea)}
                    onCerrar={onCerrar}
                    onRegistrado={onHecho}
                />
            )
        case 'tarea':
            return (
                <TareaForm
                    plan={plan}
                    equipoId={ficha.equipoId}
                    tarea={formulario.tarea}
                    onCerrar={onCerrar}
                    onGuardado={onHecho}
                />
            )
        case 'cancelar':
            return (
                <MotivoForm
                    titulo="Cancelar tarea"
                    etiqueta="Justificación"
                    boton="Cancelar tarea"
                    botonCerrar="Volver"
                    campo="justificacion"
                    aviso={{ variante: 'warning', texto: avisoCancelacion(plan, formulario.tarea) }}
                    enviar={(texto) => planesApi.cancelarTarea(formulario.tarea.id, texto)}
                    onCerrar={onCerrar}
                    onHecho={onHecho}
                />
            )
        case 'devolver':
            return (
                <MotivoForm
                    titulo="Devolver el plan"
                    etiqueta="Observaciones"
                    boton="Devolver"
                    campo="comentario"
                    aviso={{
                        variante: 'info',
                        texto: 'El plan vuelve a elaboración para que el líder lo corrija según sus observaciones.',
                    }}
                    enviar={(texto) => planesApi.resolver(plan.id, 'DEVUELTO', texto)}
                    onCerrar={onCerrar}
                    onHecho={onHecho}
                />
            )
        case 'version':
            return (
                <MotivoForm
                    titulo={`Nueva versión del plan (${plan.version + 1})`}
                    etiqueta="Motivo"
                    boton="Crear versión"
                    campo="motivo"
                    aviso={{
                        variante: 'info',
                        texto: `Se copian el plan y sus tareas no canceladas; la versión ${plan.version} queda en solo lectura. El elemento vuelve a Plan en elaboración hasta que se apruebe la nueva.`,
                    }}
                    enviar={(texto) => planesApi.nuevaVersion(plan.id, texto)}
                    onCerrar={onCerrar}
                    onHecho={onHecho}
                />
            )
    }
}
