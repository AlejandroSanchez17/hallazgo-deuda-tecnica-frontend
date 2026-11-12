import type { ButtonHTMLAttributes } from 'react'

interface BotonIconoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    etiqueta: string
}

// Solo se ve el icono: la etiqueta la leen los lectores de pantalla y aparece al pasar el mouse
export const BotonIcono = ({ etiqueta, type = 'button', className = '', ...props }: BotonIconoProps) => (
    <button
        type={type}
        aria-label={etiqueta}
        title={etiqueta}
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-texto-secundario transition-colors hover:bg-borde-suave hover:text-texto focus-visible:outline-2 focus-visible:outline-texto-secundario disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
)
