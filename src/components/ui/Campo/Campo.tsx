import { useId, type ComponentProps } from 'react'
import { clasesControl, idDescripcion } from '../EnvolturaCampo/clasesControl'
import { EnvolturaCampo } from '../EnvolturaCampo/EnvolturaCampo'

interface CampoProps extends Omit<ComponentProps<'input'>, 'id'> {
    etiqueta: string
    error?: string
    ayuda?: string
    obligatorio?: boolean
}

export const Campo = ({ etiqueta, error, ayuda, obligatorio = false, className = '', ...props }: CampoProps) => {
    const id = useId()

    return (
        <EnvolturaCampo idControl={id} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error}>
            <input
                id={id}
                aria-required={obligatorio || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={idDescripcion(id, error, ayuda)}
                className={`${clasesControl(Boolean(error))} ${className}`}
                {...props}
            />
        </EnvolturaCampo>
    )
}
