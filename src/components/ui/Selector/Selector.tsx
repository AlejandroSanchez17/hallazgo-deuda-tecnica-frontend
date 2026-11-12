import { useId, type ComponentProps } from 'react'
import { clasesControl, idDescripcion } from '../EnvolturaCampo/clasesControl'
import { EnvolturaCampo } from '../EnvolturaCampo/EnvolturaCampo'

export interface OpcionSelector {
    valor: string | number
    texto: string
}

interface SelectorProps extends Omit<ComponentProps<'select'>, 'id' | 'children'> {
    etiqueta: string
    opciones: OpcionSelector[]
    textoVacio?: string | null
    error?: string
    ayuda?: string
    obligatorio?: boolean
    ocultarEtiqueta?: boolean
}

export const Selector = ({
    etiqueta,
    opciones,
    textoVacio = 'Seleccione…',
    error,
    ayuda,
    obligatorio = false,
    ocultarEtiqueta = false,
    className = '',
    ...props
}: SelectorProps) => {
    const id = useId()

    return (
        <EnvolturaCampo
            idControl={id}
            etiqueta={etiqueta}
            obligatorio={obligatorio}
            ocultarEtiqueta={ocultarEtiqueta}
            ayuda={ayuda}
            error={error}
        >
            <select
                id={id}
                aria-required={obligatorio || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={idDescripcion(id, error, ayuda)}
                className={`${clasesControl(Boolean(error))} cursor-pointer ${className}`}
                {...props}
            >
                {textoVacio !== null && <option value="">{textoVacio}</option>}
                {opciones.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                        {opcion.texto}
                    </option>
                ))}
            </select>
        </EnvolturaCampo>
    )
}
