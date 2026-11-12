export interface ErrorCampo {
    campo: string
    mensaje: string
}

export interface ApiResponse<T> {
    exito: boolean
    mensaje: string
    datos: T
    errores: ErrorCampo[]
    fecha: string
}
