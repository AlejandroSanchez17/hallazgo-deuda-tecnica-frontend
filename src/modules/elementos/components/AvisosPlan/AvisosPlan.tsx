import { spacing } from '@hnba/design-tokens'
import { Alert } from '@hnba/react-ui'
import { formatearFechaHora } from '../../../../utils/formato'
import type { PlanResponse, ProblemaPlan } from '../../typesPlan'

interface AvisosPlanProps {
    plan: PlanResponse
}

const lista = (problemas: ProblemaPlan[]) => (
    <ul style={{ margin: 0, paddingLeft: spacing.lg }}>
        {problemas.map((problema) => (
            <li key={`${problema.campo}-${problema.tareaId ?? 'plan'}-${problema.mensaje}`}>{problema.mensaje}</li>
        ))}
    </ul>
)

// Version anterior, observaciones de la ultima devolucion, aprobacion pendiente y lo que falta para enviar.
// Los problemas los calcula el backend solo en elaboracion
export const AvisosPlan = ({ plan }: AvisosPlanProps) => {
    const aprobacion = plan.ultimaAprobacion
    const bloqueantes = plan.problemas.filter((problema) => problema.bloqueante)
    const advertencias = plan.problemas.filter((problema) => !problema.bloqueante)
    const enElaboracion = plan.vigente && plan.estado === 'EN_ELABORACION'

    return (
        <>
            {!plan.vigente && (
                <Alert
                    variant="info"
                    title={`Versión ${plan.version}: solo lectura`}
                    description="Es una versión anterior del plan. Para ver o cambiar el plan actual, elija la versión vigente."
                />
            )}
            {enElaboracion && aprobacion?.resultado === 'DEVUELTO' && (
                <Alert
                    variant="warning"
                    title={`Devuelto por ${aprobacion.resolutorNombre ?? aprobacion.rolRequeridoNombre} el ${formatearFechaHora(aprobacion.fechaResolucion)}`}
                    description={aprobacion.comentario ?? 'Sin observaciones'}
                />
            )}
            {plan.vigente && plan.estado === 'EN_APROBACION' && aprobacion?.resultado === 'PENDIENTE' && (
                <Alert
                    variant="info"
                    title={`En aprobación de ${aprobacion.rolRequeridoNombre}`}
                    description={`Enviado por ${aprobacion.solicitanteNombre} el ${formatearFechaHora(aprobacion.fechaSolicitud)}.`}
                />
            )}
            {enElaboracion && bloqueantes.length > 0 && (
                <Alert variant="error" title="Para enviar a aprobación falta:">
                    {lista(bloqueantes)}
                </Alert>
            )}
            {enElaboracion && advertencias.length > 0 && (
                <Alert variant="warning" title="Revise:">
                    {lista(advertencias)}
                </Alert>
            )}
        </>
    )
}
