import { useId, type ComponentProps } from 'react'
import { clasesControl, idDescripcion } from '../EnvolturaCampo/clasesControl'
import { EnvolturaCampo } from '../EnvolturaCampo/EnvolturaCampo'

interface AreaTextoProps extends Omit<ComponentProps<'textarea'>, 'id'> {
    etiqueta: string
    error?: string
    ayuda?: string
    obligatorio?: boolean
}

export const AreaTexto = ({
    etiqueta,
    error,
    ayuda,
    obligatorio = false,
    rows = 3,
    className = '',
    ...props
}: AreaTextoProps) => {
    const id = useId()
    const contador =
        props.maxLength !== undefined && typeof props.value === 'string' ? (
            <span className="shrink-0 text-texto-secundario">
                {props.value.length}/{props.maxLength}
            </span>
        ) : undefined

    return (
        <EnvolturaCampo
            idControl={id}
            etiqueta={etiqueta}
            obligatorio={obligatorio}
            ayuda={ayuda}
            error={error}
            extra={contador}
        >
            <textarea
                id={id}
                rows={rows}
                aria-required={obligatorio || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={idDescripcion(id, error, ayuda)}
                className={`${clasesControl(Boolean(error))} resize-y ${className}`}
                {...props}
            />
        </EnvolturaCampo>
    )
}
