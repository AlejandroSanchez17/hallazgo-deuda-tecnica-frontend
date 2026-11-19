import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import type { ComentarioResponse, FuenteComentarios } from '../typesComentario'

export const MAXIMO_COMENTARIO = 2000

interface Lista {
    fuente: FuenteComentarios
    comentarios: ComentarioResponse[]
}

// fuente debe ser estable (useMemo por el id del elemento o del plan): al cambiar se vuelve a pedir la lista.
// Al guardar se limpia el cuadro y solo se recarga la lista
export const useComentarios = (fuente: FuenteComentarios) => {
    const [lista, setLista] = useState<Lista | null>(null)
    const [version, setVersion] = useState(0)
    const [texto, setTexto] = useState('')
    const [error, setError] = useState<string | undefined>()
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        let vigente = true
        fuente
            .listar()
            .then((comentarios) => vigente && setLista({ fuente, comentarios }))
            .catch((causa: unknown) => {
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(causa))
                    setLista({ fuente, comentarios: [] })
                }
            })
        return () => {
            vigente = false
        }
    }, [fuente, version])

    const enviar = async () => {
        setEnviando(true)
        setError(undefined)
        try {
            void avisarExito(await fuente.agregar(texto.trim()))
            setTexto('')
            setVersion((previa) => previa + 1)
        } catch (causa) {
            const errorApi = aErrorApi(causa)
            // 400 en texto; 422 en estado si es una version anterior del plan
            setError(errorApi.errores.find((e) => e.campo === 'texto' || e.campo === 'estado')?.mensaje)
            avisarSiNoSeAviso(errorApi)
        } finally {
            setEnviando(false)
        }
    }

    const actual = lista?.fuente === fuente ? lista.comentarios : null

    return {
        comentarios: actual ?? [],
        cargando: actual === null,
        texto,
        cambiarTexto: (valor: string) => {
            setTexto(valor.slice(0, MAXIMO_COMENTARIO))
            setError(undefined)
        },
        puedeEnviar: texto.trim() !== '' && !enviando,
        enviando,
        error,
        enviar: () => void enviar(),
    }
}
