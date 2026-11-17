import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { formatearFecha } from '../../../utils/formato'

interface Fechas {
    identificacion: string
    compromiso: string
    // La compromiso es distinta de la sugerida
    cambiada: boolean
}

interface Pendiente extends Fechas {
    continuar: () => void
}

// Las fechas no se editan despues de registrar (la original es inmutable en la base): se confirman antes de enviar.
// La pantalla debe dibujar `dialogo`
export const useConfirmarFechas = () => {
    const [pendiente, setPendiente] = useState<Pendiente | null>(null)

    const confirmar = (fechas: Fechas, continuar: () => void) => setPendiente({ ...fechas, continuar })

    const dialogo = (
        <ConfirmDialog
            open={pendiente !== null}
            kind="alert"
            variant="warning"
            title="¿Registrar con estas fechas?"
            description={
                pendiente
                    ? `Identificación: ${formatearFecha(pendiente.identificacion)} · Compromiso: ${formatearFecha(pendiente.compromiso)}${pendiente.cambiada ? ' (distinta de la sugerida)' : ''}. Después de registrar no se pueden cambiar; para mover la fecha compromiso habrá que solicitar una prórroga.`
                    : ''
            }
            confirmLabel="Registrar"
            cancelLabel="Revisar"
            onConfirm={() => {
                pendiente?.continuar()
                setPendiente(null)
            }}
            onClose={() => setPendiente(null)}
        />
    )

    return { confirmar, dialogo }
}
