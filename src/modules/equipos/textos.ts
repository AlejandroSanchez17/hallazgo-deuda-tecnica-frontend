import type { TextosRegistro } from './types'

export const TEXTOS = {
    equipo: { sustantivo: 'equipo', articulo: 'el', femenino: false },
} satisfies Record<string, TextosRegistro>

// conGenero(textos, 'Activ') da "Activa" o "Activo"
export const conGenero = (textos: TextosRegistro, raiz: string) => `${raiz}${textos.femenino ? 'a' : 'o'}`

export const mensajeExito = (textos: TextosRegistro, raizParticipio: string) =>
    `${textos.sustantivo.charAt(0).toUpperCase()}${textos.sustantivo.slice(1)} ${conGenero(textos, raizParticipio)}`
