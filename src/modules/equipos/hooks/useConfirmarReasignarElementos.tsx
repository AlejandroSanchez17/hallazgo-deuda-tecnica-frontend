import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'

type Continuar = (reasignarElementos: boolean | undefined) => void

// RF-EQP-05: si el equipo tiene elementos abiertos, pregunta si pasan al nuevo lider; la pantalla dibuja `dialogo`.
// "Sí" envia true, "No" envia false y cerrar la ventana no envia nada
export const useConfirmarReasignarElementos = (elementosAbiertos: number, liderAnterior: string) => {
    const [pendiente, setPendiente] = useState<{ nombre: string; continuar: Continuar } | null>(null)

    const preguntarSiHaceFalta = (nombre: string, continuar: Continuar) => {
        if (elementosAbiertos > 0) {
            setPendiente({ nombre, continuar })
        } else {
            continuar(undefined)
        }
    }

    const responder = (reasignar: boolean) => {
        pendiente?.continuar(reasignar)
        setPendiente(null)
    }

    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="alert"
            variant="warning"
            title="¿Pasar los elementos abiertos al nuevo líder?"
            description={`El equipo tiene ${elementosAbiertos === 1 ? '1 elemento abierto' : `${elementosAbiertos} elementos abiertos`}. Los que lidera ${liderAnterior} pueden pasar a ${pendiente?.nombre ?? 'el nuevo líder'}; si no, siguen con ${liderAnterior}.`}
            confirmLabel="Sí, pasarlos"
            cancelLabel="No, dejarlos"
            onConfirm={() => responder(true)}
            onCancel={() => responder(false)}
            onClose={() => setPendiente(null)}
        />
    )

    return { preguntarSiHaceFalta, dialogo }
}
