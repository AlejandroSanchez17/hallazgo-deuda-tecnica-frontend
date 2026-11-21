import { useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { bitacoraApi } from '../api'
import type { PaginaBitacora } from '../types'

export const TAMANOS_PAGINA = [10, 50, 100]

interface Resultado {
    clave: string
    pagina: PaginaBitacora | null
    error: ErrorApi | null
}

// La bitacora se pagina en el backend: cada cambio de pagina, de tamano o de filtros es una consulta. Con una consulta
// nueva (`consulta` cambia de contenido) se vuelve a la primera pagina. Las paginas se numeran desde 1 en la pantalla
// (como la Pagination de la libreria) y desde 0 en la API
export const useBitacora = (consulta: Record<string, string>) => {
    const claveConsulta = JSON.stringify(consulta)
    const [pagina, setPagina] = useState(1)
    const [tamano, setTamano] = useState(TAMANOS_PAGINA[0])
    const [claveAnterior, setClaveAnterior] = useState(claveConsulta)
    const [resultado, setResultado] = useState<Resultado | null>(null)

    if (claveAnterior !== claveConsulta) {
        setClaveAnterior(claveConsulta)
        setPagina(1)
    }

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
        pagina,
        tamano,
        irAPagina: setPagina,
        cambiarTamano: (nuevo: number) => {
            setTamano(nuevo)
            setPagina(1)
        },
    }
}
