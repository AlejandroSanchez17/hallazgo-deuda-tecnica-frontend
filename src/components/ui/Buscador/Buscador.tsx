import { useId } from 'react'
import { clasesControl } from '../EnvolturaCampo/clasesControl'
import { IconoBuscar } from '../Iconos/IconoBuscar'
import { IconoCerrar } from '../Iconos/IconoCerrar'

interface BuscadorProps {
    valor: string
    onCambiar: (valor: string) => void
    etiqueta?: string
    placeholder?: string
}

export const Buscador = ({ valor, onCambiar, etiqueta = 'Buscar', placeholder = 'Buscar…' }: BuscadorProps) => {
    const id = useId()

    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">
                {etiqueta}
            </label>
            <IconoBuscar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-texto-secundario" />
            <input
                id={id}
                type="text"
                enterKeyHint="search"
                autoComplete="off"
                value={valor}
                onChange={(evento) => onCambiar(evento.target.value)}
                placeholder={placeholder}
                className={`${clasesControl(false)} pr-9 pl-9`}
            />
            {valor !== '' && (
                <button
                    type="button"
                    onClick={() => onCambiar('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-texto-secundario hover:bg-borde-suave"
                >
                    <IconoCerrar className="size-3.5" />
                </button>
            )}
        </div>
    )
}
