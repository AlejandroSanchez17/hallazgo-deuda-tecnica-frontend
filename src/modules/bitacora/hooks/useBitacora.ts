import { useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { bitacoraApi } from '../api'
import type { PaginaBitacora } from '../types'

interface Resultado {
    clave: string
    pagina: PaginaBitacora | null
    error: ErrorApi | null
}

// La bitacora se pagina en el backend: cada cambio de pagina, de tamano o de filtros es una consulta. Las paginas se
// numeran desde 1 en la pantalla (como la Pagination de la libreria) y desde 0 en la API
export const useBitacora = (consulta: Record<string, string>, pagina: number, tamano: number) => {
    const claveConsulta = JSON.stringify(consulta)
    const [resultado, setResultado] = useState<Resultado | null>(null)

    const clave = `${claveConsulta}|${pagina}|${tamano}`

    useEffect(() => {
        let vigente = true
        bitacoraApi
            .listar(pagina - 1, tamano, JSON.parse(claveConsulta) as Record<string, string>)
            .then((datos) => {
                if (vigente) {
                    setResultado({ clave, pagina: datos, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({ clave, pagina: null, error: aErrorApi(error) })
                }
            })
        return () => {
            vigente = false
        }
    }, [claveConsulta, pagina, tamano, clave])

    const vigente = resultado?.clave === clave ? resultado : null

    return {
        registros: vigente?.pagina?.contenido ?? [],
        total: vigente?.pagina?.totalElementos ?? 0,
        // Mientras llega la consulta nueva se muestra "Cargando"
        cargando: vigente === null,
        error: vigente?.error ?? null,
    }
}
