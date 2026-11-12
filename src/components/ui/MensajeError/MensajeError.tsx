import { IconoError } from '../Iconos/IconoError'

interface MensajeErrorProps {
    mensaje: string
}

export const MensajeError = ({ mensaje }: MensajeErrorProps) => (
    <p className="flex items-center gap-2 text-sm text-error" role="alert">
        <IconoError className="size-4 shrink-0" />
        {mensaje}
    </p>
)
