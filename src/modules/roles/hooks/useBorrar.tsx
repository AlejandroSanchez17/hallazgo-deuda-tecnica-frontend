import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import type { RolResponse } from '../types'

// Pide confirmacion con el ConfirmDialog de la libreria: la pantalla debe dibujar `dialogo`.
// Si el rol esta en uso el backend responde 422 con el motivo y se avisa tal cual
export const useBorrar = (borrar: (id: number) => Promise<void>, onBorrado: () => void) => {
    const [pendiente, setPendiente] = useState<RolResponse | null>(null)
    const [borrando, setBorrando] = useState(false)

    const confirmar = async () => {
        if (!pendiente) {
            return
        }
        setBorrando(true)
        try {
            await borrar(pendiente.id)
            void avisarExito('Rol borrado')
            onBorrado()
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setBorrando(false)
            setPendiente(null)
        }
    }

    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="alert"
            variant="error"
            title={`¿Borrar el rol ${pendiente?.nombre ?? ''}?`}
            description="Se borra para siempre, con sus permisos. Si ya tiene usuarios, criticidades o aprobaciones no se puede borrar: desactívelo en su lugar."
            confirmLabel="Borrar"
            cancelLabel="Cancelar"
            confirmLoading={borrando}
            onConfirm={() => void confirmar()}
            onClose={() => setPendiente(null)}
        />
    )

    return { pedirBorrado: setPendiente, dialogo }
}
