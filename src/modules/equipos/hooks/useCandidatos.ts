import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { equiposApi } from '../api'
import { aOpciones, type OpcionCandidato } from '../candidatos'
import type { CandidatoResponse, ParaCandidatos } from '../types'

const pedir = (para: ParaCandidatos, equipoId?: number): Promise<CandidatoResponse[]> => {
    if (para === 'NUEVO_EQUIPO') {
        return equiposApi.candidatosLiderNuevoEquipo()
    }
    if (equipoId === undefined) {
        return Promise.resolve([])
    }
    return equiposApi.candidatos(equipoId, para === 'LIDER' ? 'LIDER' : undefined)
}

// Opciones del combo de lider o de miembro; con activo en false no pide nada (por ejemplo, al editar)
export const useCandidatos = (para: ParaCandidatos, equipoId?: number, activo = true) => {
    const [opciones, setOpciones] = useState<OpcionCandidato[]>([])

    useEffect(() => {
        if (!activo) {
            return
        }
        let vigente = true
        pedir(para, equipoId)
            .then((candidatos) => {
                if (vigente) {
                    setOpciones(aOpciones(candidatos))
                }
            })
            .catch((error: unknown) => {
                // 404 (equipo inexistente) y 422 (equipo inactivo) se avisan; el 403 ya lo aviso el interceptor
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(error))
                }
            })
        return () => {
            vigente = false
        }
    }, [para, equipoId, activo])

    return opciones
}
