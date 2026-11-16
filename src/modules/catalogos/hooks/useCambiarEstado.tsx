import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { conGenero, mensajeExito } from '../textos'
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
            kind="alert"
            variant={pendiente?.activo ? 'error' : 'warning'}
            title={`¿${accion} ${textos.articulo} ${textos.sustantivo} ${pendiente?.nombre ?? ''}?`}
            description={
                pendiente?.activo
                    ? `Mientras esté ${conGenero(textos, 'inactiv')} no se ofrecerá en los formularios.`
                    : 'Volverá a ofrecerse en los formularios.'
            }
            confirmLabel={accion}
            cancelLabel="Cancelar"
            confirmLoading={cambiando}
            onConfirm={() => void confirmar()}
            onClose={() => setPendiente(null)}
        />
    )

    return { cambiarEstado, dialogo }
}
