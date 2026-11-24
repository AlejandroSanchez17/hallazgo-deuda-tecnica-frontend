import type { ReactNode } from 'react'

// Codigos, fechas y plazos de una celda: van en una sola linea (las celdas saltan de linea por una regla global)
export const TextoSinCorte = ({ children }: { children: ReactNode }) => (
    <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
)
