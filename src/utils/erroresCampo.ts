import type { ErrorCampo } from '../types/api.types'

export type ErroresCampo = Partial<Record<string, string>>

export const aErroresCampo = (errores: ErrorCampo[]): ErroresCampo =>
    Object.fromEntries(errores.map((error) => [error.campo, error.mensaje]))
