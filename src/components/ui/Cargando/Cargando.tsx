interface CargandoProps {
    texto?: string
}

export const Cargando = ({ texto = 'Cargando…' }: CargandoProps) => (
    <div className="flex items-center gap-2 text-sm text-texto-secundario" role="status">
        <span
            className="size-4 animate-spin rounded-full border-2 border-borde border-t-texto-secundario"
            aria-hidden="true"
        />
        {texto}
    </div>
)
