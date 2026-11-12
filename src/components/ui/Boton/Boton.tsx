import type { ButtonHTMLAttributes } from 'react'

type VarianteBoton = 'primario' | 'secundario' | 'texto'

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: VarianteBoton
}

const clasesPorVariante: Record<VarianteBoton, string> = {
    primario: 'bg-primario text-blanco hover:bg-primario-hover',
    secundario: 'border border-borde bg-blanco text-texto hover:bg-fondo',
    texto: 'text-texto hover:bg-borde-suave',
}

// Secundario por defecto: el rojo se reserva para la accion principal de cada pantalla
export const Boton = ({ variante = 'secundario', type = 'button', className = '', ...props }: BotonProps) => (
    <button
        type={type}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primario disabled:cursor-not-allowed disabled:opacity-50 ${clasesPorVariante[variante]} ${className}`}
        {...props}
    />
)
