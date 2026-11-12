// "pdf, png,,jpg " -> ['pdf', 'png', 'jpg']
export const separarLista = (valor: string) =>
    valor
        .split(',')
        .map((elemento) => elemento.trim())
        .filter((elemento) => elemento !== '')
