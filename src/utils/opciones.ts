// Opcion de un Select de la libreria: valor en texto (como lo guarda el formulario) y texto visible
export interface Opcion {
    valor: string
    texto: string
}

export const textoDeOpcion = (opcion: Opcion) => opcion.texto

export const valorDeOpcion = (opcion: Opcion) => opcion.valor

// Select recibe el objeto seleccionado; los formularios guardan solo su valor
export const opcionDe = (opciones: Opcion[], valor: string): Opcion | null =>
    opciones.find((opcion) => opcion.valor === valor) ?? null
