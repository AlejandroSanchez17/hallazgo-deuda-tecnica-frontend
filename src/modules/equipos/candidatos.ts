import type { Opcion } from '../../utils/opciones'
import type { CandidatoResponse } from './types'

// Opcion de los combos de lider y miembro; el nombre sirve para las confirmaciones
export interface OpcionCandidato extends Opcion {
    nombre: string
}

export const aOpciones = (candidatos: CandidatoResponse[]): OpcionCandidato[] =>
    candidatos.map((candidato) => ({
        valor: String(candidato.usuarioId),
        texto: `${candidato.nombre} (${candidato.usuarioRed})`,
        nombre: candidato.nombre,
    }))
