import { NavLink } from 'react-router-dom'

export interface Pestana {
    ruta: string
    texto: string
}

interface PestanasProps {
    pestanas: Pestana[]
    etiqueta: string
}

const clasesPestana = ({ isActive }: { isActive: boolean }) =>
    `-mb-px border-b-2 px-4 py-2 text-sm whitespace-nowrap ${isActive ? 'border-texto font-semibold text-texto' : 'border-transparente text-texto-secundario hover:text-texto'}`

export const Pestanas = ({ pestanas, etiqueta }: PestanasProps) => (
    <nav aria-label={etiqueta} className="flex flex-wrap gap-1 border-b border-borde">
        {pestanas.map((pestana) => (
            <NavLink key={pestana.ruta} to={pestana.ruta} className={clasesPestana}>
                {pestana.texto}
            </NavLink>
        ))}
    </nav>
)
