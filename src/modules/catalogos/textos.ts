import type { TextosCatalogo } from './types'

export const TEXTOS = {
    area: { sustantivo: 'área', articulo: 'el', femenino: true },
    origen: { sustantivo: 'origen', articulo: 'el', femenino: false },
    categoria: { sustantivo: 'categoría', articulo: 'la', femenino: true },
    aplicacion: { sustantivo: 'aplicación', articulo: 'la', femenino: true },
    criticidad: { sustantivo: 'criticidad', articulo: 'la', femenino: true },
} satisfies Record<string, TextosCatalogo>

// conGenero(textos, 'Activ') da "Activa" o "Activo"
export const conGenero = (textos: TextosCatalogo, raiz: string) => `${raiz}${textos.femenino ? 'a' : 'o'}`

export const mensajeExito = (textos: TextosCatalogo, raizParticipio: string) =>
    `${textos.sustantivo.charAt(0).toUpperCase()}${textos.sustantivo.slice(1)} ${conGenero(textos, raizParticipio)}`
