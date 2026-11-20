// Este parametro (ENTERO) guarda el id de un rol: se edita con un selector de roles activos, no con un numero
export const CLAVE_ROL_VALIDA_CIERRE = 'rol_valida_cierre_hallazgo'

// "pdf, png,,jpg " -> ['pdf', 'png', 'jpg']
export const separarLista = (valor: string) =>
    valor
        .split(',')
        .map((elemento) => elemento.trim())
        .filter((elemento) => elemento !== '')
