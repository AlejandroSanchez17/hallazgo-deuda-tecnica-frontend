import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type { ComentarioResponse, FuenteComentarios } from './typesComentario'

// Cada lista trae solo lo suyo: los del elemento no incluyen los de sus planes, y los de un plan son de esa version
const fuente = (ruta: string): FuenteComentarios => ({
    listar: async () => {
        const { data } = await api.get<ApiResponse<ComentarioResponse[]>>(ruta)
        return data.datos
    },
    agregar: async (texto: string) => {
        const { data } = await api.post<ApiResponse<ComentarioResponse>>(ruta, { texto })
        return data.mensaje
    },
})

export const comentariosApi = {
    delElemento: (elementoId: number) => fuente(`/elementos/${elementoId}/comentarios`),
    delPlan: (planId: number) => fuente(`/planes/${planId}/comentarios`),
}
