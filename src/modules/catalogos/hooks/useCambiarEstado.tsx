import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { mensajeExito } from '../textos'
import type { RegistroCatalogo, TextosCatalogo } from '../types'

// Pide confirmacion con el ConfirmDialog de la libreria: la pantalla debe dibujar `dialogo`
export const useCambiarEstado = (
    cambiar: (id: number, activo: boolean) => Promise<unknown>,
    textos: TextosCatalogo,
    onCambiado: () => void,
) => {
    const [pendiente, setPendiente] = useState<RegistroCatalogo | null>(null)
    const [cambiando, setCambiando] = useState(false)

    const cambiarEstado = (registro: RegistroCatalogo) => setPendiente(registro)

    const confirmar = async () => {
        if (!pendiente) {
            return
        }
        const activar = !pendiente.activo
        setCambiando(true)
        try {
            await cambiar(pendiente.id, activar)
            void avisarExito(mensajeExito(textos, activar ? 'activad' : 'desactivad'))
            onCambiado()
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setCambiando(false)
            setPendiente(null)
        }
    }

    const accion = pendiente?.activo ? 'Desactivar' : 'Activar'
    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="confirm"
            variant="warning"
            title={`¿${accion} ${textos.articulo} ${textos.sustantivo} ${pendiente?.nombre ?? ''}?`}
            confirmLabel={accion}
            cancelLabel="Cancelar"
            confirmLoading={cambiando}
            onConfirm={() => void confirmar()}
            onClose={() => setPendiente(null)}
        />
    )

    return { cambiarEstado, dialogo }
}
