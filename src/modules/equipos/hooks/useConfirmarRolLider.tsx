import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import type { OpcionCandidato } from '../candidatos'

interface Pendiente {
    nombre: string
    continuar: () => void
}

// Si el lider elegido no tiene el rol Lider tecnico, pregunta antes de enviar; la pantalla debe dibujar `dialogo`.
// enviar recibe asignarRolLider: true solo si se confirmo
export const useConfirmarRolLider = () => {
    const [pendiente, setPendiente] = useState<Pendiente | null>(null)

    const confirmarSiHaceFalta = (opcion: OpcionCandidato | undefined, enviar: (asignarRolLider: boolean) => void) => {
        if (opcion?.requiereRol) {
            setPendiente({ nombre: opcion.nombre, continuar: () => enviar(true) })
        } else {
            enviar(false)
        }
    }

    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="alert"
            variant="warning"
            title="¿Asignar el rol Líder técnico?"
            description={`Se le asignará el rol Líder técnico a ${pendiente?.nombre ?? ''}. ¿Continuar?`}
            confirmLabel="Continuar"
            cancelLabel="Cancelar"
            onConfirm={() => {
                pendiente?.continuar()
                setPendiente(null)
            }}
            onClose={() => setPendiente(null)}
        />
    )

    return { confirmarSiHaceFalta, dialogo }
}
