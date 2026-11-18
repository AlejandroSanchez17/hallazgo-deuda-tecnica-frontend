import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { planesApi } from '../apiPlan'
import type { PlanResponse } from '../typesPlan'

type Accion = 'enviar' | 'aprobar'

const TEXTOS: Record<Accion, { titulo: string; boton: string; descripcion: (plan: PlanResponse) => string }> = {
    enviar: {
        titulo: '¿Enviar el plan a aprobación?',
        boton: 'Enviar',
        descripcion: (plan) =>
            `Lo aprueba el rol ${plan.rolAprobadorNombre}. Mientras esté en aprobación no se puede editar el plan ni sus tareas.`,
    },
    aprobar: {
        titulo: '¿Aprobar el plan?',
        boton: 'Aprobar',
        descripcion: (plan) => `El elemento ${plan.elementoCodigo} pasa a En ejecución con este plan.`,
    },
}

// Enviar y aprobar no piden datos, solo confirmacion. La pantalla debe dibujar `dialogo`.
// Al terminar (bien o mal) se recarga: un 422 al enviar cambia los problemas que se muestran
export const useAccionesPlan = (plan: PlanResponse | null, onHecho: () => void) => {
    const [accion, setAccion] = useState<Accion | null>(null)
    const [enviando, setEnviando] = useState(false)

    const confirmar = async () => {
        if (!plan || !accion) {
            return
        }
        setEnviando(true)
        try {
            const mensaje =
                accion === 'enviar' ? await planesApi.enviar(plan.id) : await planesApi.resolver(plan.id, 'APROBADO')
            void avisarExito(mensaje)
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setEnviando(false)
            setAccion(null)
            onHecho()
        }
    }

    const textos = accion ? TEXTOS[accion] : null

    const dialogo = (
        <ConfirmDialog
            open={accion !== null}
            kind="alert"
            variant={accion === 'aprobar' ? 'success' : 'info'}
            title={textos?.titulo ?? ''}
            description={textos && plan ? textos.descripcion(plan) : ''}
            confirmLabel={textos?.boton}
            cancelLabel="Cancelar"
            confirmLoading={enviando}
            onConfirm={() => void confirmar()}
            onClose={() => setAccion(null)}
        />
    )

    return {
        pedirEnvio: () => setAccion('enviar'),
        pedirAprobacion: () => setAccion('aprobar'),
        dialogo,
    }
}
