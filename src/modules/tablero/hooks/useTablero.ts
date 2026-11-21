import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso, type ErrorApi } from '../../../services/api'
import { tableroApi } from '../api'
import { aConsulta } from '../filtros'
import type { FiltrosTablero, TableroResponse } from '../types'

interface Resultado {
    // Consulta a la que responde: mientras llega la siguiente se siguen mostrando los datos anteriores
    consulta: string
    datos: TableroResponse | null
    error: ErrorApi | null
}

// Se pide de nuevo cada vez que cambia el periodo; si llegan dos respuestas, solo cuenta la de la ultima consulta
export const useTablero = (filtros: FiltrosTablero) => {
    const consulta = JSON.stringify(aConsulta(filtros, new Date()))
    const [resultado, setResultado] = useState<Resultado | null>(null)

    useEffect(() => {
        let vigente = true
        tableroApi
            .obtener(JSON.parse(consulta) as Record<string, string>)
            .then((datos) => {
                if (vigente) {
                    setResultado({ consulta, datos, error: null })
                }
            })
            .catch((error: unknown) => {
                const errorApi = aErrorApi(error)
                if (vigente) {
                    // El 422 del periodo se marca en su campo; los demas los avisa la pantalla o el interceptor
                    if (errorApi.estado !== 422) {
                        avisarSiNoSeAviso(errorApi)
                    }
                    setResultado((anterior) => ({ consulta, datos: anterior?.datos ?? null, error: errorApi }))
                }
            })
        return () => {
            vigente = false
        }
    }, [consulta])

    const error = resultado?.consulta === consulta ? resultado.error : null
    return {
        datos: resultado?.datos ?? null,
        cargando: resultado?.consulta !== consulta,
        error,
        // 422 en 'hasta': el periodo no es valido
        errorPeriodo:
            error?.errores.find((e) => e.campo === 'hasta')?.mensaje ?? (error?.estado === 422 ? error.mensaje : null),
    }
}
