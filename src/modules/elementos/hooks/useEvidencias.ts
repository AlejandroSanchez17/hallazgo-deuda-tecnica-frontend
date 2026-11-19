import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { evidenciasApi } from '../apiEvidencias'
import type { EvidenciaResponse } from '../typesEvidencia'

interface Lista {
    clave: string
    evidencias: EvidenciaResponse[]
}

// Las del elemento o, con tareaId, solo las de esa tarea; vigentes y reemplazadas, la mas reciente primero
export const useEvidencias = (elementoId: number, tareaId?: number) => {
    const [lista, setLista] = useState<Lista | null>(null)
    const [version, setVersion] = useState(0)
    const clave = `${elementoId}-${tareaId ?? ''}`

    useEffect(() => {
        let vigente = true
        evidenciasApi
            .listar(elementoId, tareaId)
            .then((evidencias) => vigente && setLista({ clave, evidencias }))
            .catch((error: unknown) => {
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(error))
                    setLista({ clave, evidencias: [] })
                }
            })
        return () => {
            vigente = false
        }
    }, [elementoId, tareaId, clave, version])

    const recargar = useCallback(() => setVersion((previa) => previa + 1), [])
    const actual = lista?.clave === clave ? lista.evidencias : null

    return {
        evidencias: actual ?? [],
        // Al recargar se sigue mostrando la lista anterior
        cargando: actual === null,
        recargar,
    }
}
