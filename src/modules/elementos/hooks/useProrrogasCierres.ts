import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { cierresApi, prorrogasApi } from '../apiProrrogas'
import type { CierreResponse, ProrrogasDelElemento } from '../typesProrroga'

interface Resultado {
    clave: string
    resumen: ProrrogasDelElemento | null
    cierres: CierreResponse[]
    error: ErrorApi | null
}

// Se piden al abrir el detalle (no al abrir la pestana) porque el aviso de lo pendiente va sobre las pestanas.
// Sin el permiso de leer no se pide (el Miembro de equipo recibiria 403)
export const useProrrogasCierres = (elementoId: number, veProrrogas: boolean, veCierre: boolean) => {
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [version, setVersion] = useState(0)
    const clave = `${elementoId}|${veProrrogas}|${veCierre}`

    useEffect(() => {
        let vigente = true
        Promise.all([
            veProrrogas ? prorrogasApi.delElemento(elementoId) : Promise.resolve(null),
            veCierre ? cierresApi.delElemento(elementoId) : Promise.resolve([]),
        ])
            .then(([resumen, cierres]) => {
                if (vigente) {
                    setResultado({ clave, resumen, cierres, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({ clave, resumen: null, cierres: [], error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [elementoId, veProrrogas, veCierre, clave, version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    // Al recargar se siguen mostrando los datos actuales
    const delActual = resultado?.clave === clave ? resultado : null
    return {
        resumen: delActual?.resumen ?? null,
        cierres: delActual?.cierres ?? [],
        cargando: delActual === null,
        error: delActual?.error ?? null,
        recargar,
    }
}
