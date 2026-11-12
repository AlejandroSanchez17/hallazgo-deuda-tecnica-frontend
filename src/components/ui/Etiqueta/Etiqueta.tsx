import type { ReactNode } from 'react'

type VarianteEtiqueta = 'normal' | 'apagada'

interface EtiquetaProps {
    variante?: VarianteEtiqueta
    children: ReactNode
}

const clasesPorVariante: Record<VarianteEtiqueta, string> = {
    normal: 'border-borde bg-blanco text-texto',
    apagada: 'border-borde-suave bg-fondo text-texto-secundario',
}

export const Etiqueta = ({ variante = 'normal', children }: EtiquetaProps) => (
    <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${clasesPorVariante[variante]}`}
    >
        {children}
    </span>
)
