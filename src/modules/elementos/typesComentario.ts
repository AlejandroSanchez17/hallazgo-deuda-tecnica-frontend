// GET /elementos/{id}/comentarios y /planes/{id}/comentarios, el mas reciente primero. No se editan ni se borran
export interface ComentarioResponse {
    id: number
    // Fecha y hora ISO
    fecha: string
    texto: string
    usuarioId: number
    usuarioNombre: string
}

// Las dos funciones de la API que usa la lista: la del elemento o la de un plan
export interface FuenteComentarios {
    listar: () => Promise<ComentarioResponse[]>
    // Devuelve el mensaje del backend ("Comentario agregado")
    agregar: (texto: string) => Promise<string>
}
