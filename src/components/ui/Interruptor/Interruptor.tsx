import { useId } from 'react'

interface InterruptorProps {
    etiqueta: string
    activo: boolean
    onCambiar: (activo: boolean) => void
    disabled?: boolean
}

export const Interruptor = ({ etiqueta, activo, onCambiar, disabled = false }: InterruptorProps) => {
    const id = useId()

    return (
        <div className="flex items-center gap-3">
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={activo}
                disabled={disabled}
                onClick={() => onCambiar(!activo)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-texto-secundario disabled:cursor-not-allowed disabled:opacity-50 ${activo ? 'bg-texto' : 'bg-borde'}`}
            >
                <span
                    className={`inline-block size-5 rounded-full bg-blanco shadow transition-transform ${activo ? 'translate-x-5.5' : 'translate-x-0.5'}`}
                />
            </button>
            <label htmlFor={id} className="cursor-pointer text-sm text-texto">
                {etiqueta}
            </label>
        </div>
    )
}
