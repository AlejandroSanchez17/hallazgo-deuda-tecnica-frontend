import type { ReactNode } from 'react'

interface SeccionProps {
    titulo: string
    children: ReactNode
}

export const Seccion = ({ titulo, children }: SeccionProps) => (
    <section className="rounded-md border border-borde bg-blanco p-6">
        <h2 className="mb-4 text-base font-semibold">{titulo}</h2>
        {children}
    </section>
)
