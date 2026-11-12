import { SelectorUsuario } from '../SelectorUsuario/SelectorUsuario'

export const Header = () => (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-borde bg-blanco px-6">
        <span className="text-base font-bold">Hallazgos y Deuda Técnica</span>
        <SelectorUsuario />
    </header>
)
