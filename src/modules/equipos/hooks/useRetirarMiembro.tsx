import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { equiposApi } from '../api'
import type { MiembroResponse } from '../types'

// Pide confirmacion con el ConfirmDialog de la libreria: la pantalla debe dibujar `dialogo`.
// La salida queda con la fecha de hoy (el backend la pone si no se envia)
export const useRetirarMiembro = (equipoId: number, onRetirado: () => void) => {
    const [pendiente, setPendiente] = useState<MiembroResponse | null>(null)
    const [retirando, setRetirando] = useState(false)

    const confirmar = async () => {
        if (!pendiente) {
            return
        }
        setRetirando(true)
        try {
            await equiposApi.retirarMiembro(equipoId, pendiente.usuarioId)
            void avisarExito('Miembro retirado')
            onRetirado()
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setRetirando(false)
            setPendiente(null)
        }
    }

    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="alert"
            variant="error"
            title={`¿Retirar a ${pendiente?.usuarioNombre ?? ''} del equipo?`}
            description="La salida queda registrada con la fecha de hoy y se conserva en el historial."
            confirmLabel="Retirar"
            cancelLabel="Cancelar"
            confirmLoading={retirando}
            onConfirm={() => void confirmar()}
            onClose={() => setPendiente(null)}
        />
    )

    return { retirar: setPendiente, dialogo }
}
