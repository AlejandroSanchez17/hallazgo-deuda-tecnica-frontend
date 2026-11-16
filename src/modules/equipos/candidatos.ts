import type { Opcion } from '../../utils/opciones'
import type { CandidatoResponse } from './types'

// Opcion de los combos de lider y miembro; requiereRol pide confirmar que se le asignara el rol Lider tecnico
export interface OpcionCandidato extends Opcion {
    nombre: string
    requiereRol: boolean
}

// En el combo de miembro el rol no importa: la marca solo se muestra al elegir lider
export const aOpciones = (candidatos: CandidatoResponse[], paraLider: boolean): OpcionCandidato[] =>
    candidatos.map((candidato) => {
        const requiereRol = paraLider && candidato.requiereRolLider
        return {
            valor: String(candidato.usuarioId),
            texto: `${candidato.nombre} (${candidato.usuarioRed})${requiereRol ? ' · se le asignará el rol' : ''}`,
            nombre: candidato.nombre,
            requiereRol,
        }
    })
