import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import type {
    AvanceRequest,
    AvanceResponse,
    DecisionPlan,
    MiTarea,
    PlanRequest,
    PlanResponse,
    PlanResumen,
    TareaRequest,
    TareaResponse,
} from './typesPlan'

const RUTA_PLANES = '/planes'

const rutaElemento = (elementoId: number) => `/elementos/${elementoId}`

// Las acciones devuelven el mensaje del backend para el aviso ("Plan enviado a aprobación de Registrador")
export const planesApi = {
    // Sin plan responde 200 con datos en null
    vigente: async (elementoId: number): Promise<PlanResponse | null> => {
        const { data } = await api.get<ApiResponse<PlanResponse | null>>(`${rutaElemento(elementoId)}/plan`)
        return data.datos
    },
    versiones: async (elementoId: number): Promise<PlanResumen[]> => {
        const { data } = await api.get<ApiResponse<PlanResumen[]>>(`${rutaElemento(elementoId)}/planes`)
        return data.datos
    },
    obtener: async (planId: number): Promise<PlanResponse> => {
        const { data } = await api.get<ApiResponse<PlanResponse>>(`${RUTA_PLANES}/${planId}`)
        return data.datos
    },
    crear: async (elementoId: number, solicitud: PlanRequest): Promise<string> => {
        const { data } = await api.post<ApiResponse<PlanResponse>>(`${rutaElemento(elementoId)}/plan`, solicitud)
        return data.mensaje
    },
    actualizar: async (planId: number, solicitud: PlanRequest): Promise<string> => {
        const { data } = await api.put<ApiResponse<PlanResponse>>(`${RUTA_PLANES}/${planId}`, solicitud)
        return data.mensaje
    },
    enviar: async (planId: number): Promise<string> => {
        const { data } = await api.post<ApiResponse<PlanResponse>>(`${RUTA_PLANES}/${planId}/envio-aprobacion`)
        return data.mensaje
    },
    // Al devolver, el comentario (las observaciones) es obligatorio
    resolver: async (planId: number, resultado: DecisionPlan, comentario?: string): Promise<string> => {
        const { data } = await api.post<ApiResponse<PlanResponse>>(`${RUTA_PLANES}/${planId}/aprobacion`, {
            resultado,
            comentario,
        })
        return data.mensaje
    },
    nuevaVersion: async (planId: number, motivo: string): Promise<string> => {
        const { data } = await api.post<ApiResponse<PlanResponse>>(`${RUTA_PLANES}/${planId}/version`, { motivo })
        return data.mensaje
    },
    crearTarea: async (planId: number, solicitud: TareaRequest): Promise<string> => {
        const { data } = await api.post<ApiResponse<TareaResponse>>(`${RUTA_PLANES}/${planId}/tareas`, solicitud)
        return data.mensaje
    },
    actualizarTarea: async (tareaId: number, solicitud: TareaRequest): Promise<string> => {
        const { data } = await api.put<ApiResponse<TareaResponse>>(`/tareas/${tareaId}`, solicitud)
        return data.mensaje
    },
    // "Avance registrado; el plan va en 40 %"
    registrarAvance: async (tareaId: number, solicitud: AvanceRequest): Promise<string> => {
        const { data } = await api.post<ApiResponse<unknown>>(`/tareas/${tareaId}/avances`, solicitud)
        return data.mensaje
    },
    avances: async (tareaId: number): Promise<AvanceResponse[]> => {
        const { data } = await api.get<ApiResponse<AvanceResponse[]>>(`/tareas/${tareaId}/avances`)
        return data.datos
    },
    mias: async (): Promise<MiTarea[]> => {
        const { data } = await api.get<ApiResponse<MiTarea[]>>('/tareas/mias')
        return data.datos
    },
    // La base no borra: quitar una tarea es cancelarla, y deja de contar en la suma de pesos. Con el plan aprobado
    // su peso se reparte entre las demas ("…; su peso se repartió entre 2 tareas")
    cancelarTarea: async (tareaId: number, justificacion: string): Promise<string> => {
        const { data } = await api.post<ApiResponse<TareaResponse>>(`/tareas/${tareaId}/cancelacion`, {
            justificacion,
        })
        return data.mensaje
    },
}
