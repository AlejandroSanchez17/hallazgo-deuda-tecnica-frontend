import type { ReactNode } from 'react'
import { IconoError } from '../Iconos/IconoError'

interface EnvolturaCampoProps {
    idControl: string
    etiqueta: string
    obligatorio?: boolean
    ocultarEtiqueta?: boolean
    ayuda?: string
    error?: string
    extra?: ReactNode
    children: ReactNode
}

export const EnvolturaCampo = ({
    idControl,
    etiqueta,
    obligatorio = false,
    ocultarEtiqueta = false,
    ayuda,
    error,
    extra,
    children,
}: EnvolturaCampoProps) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={idControl} className={ocultarEtiqueta ? 'sr-only' : 'text-sm font-semibold text-texto'}>
            {etiqueta}
            {obligatorio && (
                <span className="ml-0.5 text-texto-secundario" aria-hidden="true">
                    *
                </span>
            )}
        </label>
        {children}
        {(error || ayuda || extra) && (
            <div className="flex items-start justify-between gap-2 text-xs">
                {error ? (
                    <p id={`${idControl}-error`} className="flex items-center gap-1 text-error">
                        <IconoError className="size-3.5 shrink-0" />
                        {error}
                    </p>
                ) : (
                    <p id={`${idControl}-ayuda`} className="text-texto-secundario">
                        {ayuda}
                    </p>
                )}
                {extra}
            </div>
        )}
    </div>
)
