// Minusculas y sin acentos, para que "area" encuentre "Área"
export const normalizar = (texto: string) =>
    texto
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()

export const nombreRoles = (roles: { nombre: string }[]) => roles.map((rol) => rol.nombre).join(', ')

// Un termino vacio coincide con todo
export const coincide = (termino: string, ...textos: (string | null | undefined)[]) =>
    termino === '' || normalizar(textos.filter(Boolean).join(' ')).includes(termino)
