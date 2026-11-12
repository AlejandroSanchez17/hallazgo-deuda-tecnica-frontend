const base =
    'w-full rounded-md border bg-blanco px-3 py-2 text-sm text-texto placeholder:text-texto-secundario focus:outline-2 focus:outline-offset-0 disabled:cursor-not-allowed disabled:bg-fondo disabled:text-texto-secundario'

export const clasesControl = (conError: boolean) =>
    `${base} ${conError ? 'border-error focus:outline-error' : 'border-borde focus:outline-texto-secundario'}`

export const idDescripcion = (idControl: string, error?: string, ayuda?: string) => {
    if (error) {
        return `${idControl}-error`
    }
    return ayuda ? `${idControl}-ayuda` : undefined
}
