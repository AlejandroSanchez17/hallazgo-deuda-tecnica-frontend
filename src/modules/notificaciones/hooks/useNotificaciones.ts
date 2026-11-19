import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { notificacionesApi } from '../api'
import type { ConsultaNotificaciones, NotificacionResponse, PaginaNotificaciones } from '../types'

interface Resultado {
    clave: string
    pagina: PaginaNotificaciones
}

const paginaVacia = (consulta: ConsultaNotificaciones): PaginaNotificaciones => ({
    contenido: [],
    pagina: consulta.pagina,
    tamano: consulta.tamano,
    totalElementos: 0,
    totalPaginas: 0,
})

// Una pagina del centro (paginado en el backend). recargar() la vuelve a pedir; marcarLocal() pinta una como leida
// sin volver a pedir la pagina
export const useNotificaciones = ({ soloNoLeidas, pagina, tamano }: ConsultaNotificaciones) => {
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [version, setVersion] = useState(0)
    const clave = `${soloNoLeidas}-${pagina}-${tamano}-${version}`

    useEffect(() => {
        let vigente = true
        const consulta = { soloNoLeidas, pagina, tamano }
        notificacionesApi
            .listar(consulta)
            .then((datos) => vigente && setResultado({ clave, pagina: datos }))
            .catch((causa: unknown) => {
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(causa))
                    setResultado({ clave, pagina: paginaVacia(consulta) })
                }
            })
        return () => {
            vigente = false
        }
    }, [clave, soloNoLeidas, pagina, tamano])

    const marcarLocal = (actualizada: NotificacionResponse) =>
        setResultado((previo) =>
            previo
                ? {
                      ...previo,
                      pagina: {
                          ...previo.pagina,
                          contenido: previo.pagina.contenido.map((n) => (n.id === actualizada.id ? actualizada : n)),
                      },
                  }
                : previo,
        )

    const actual = resultado?.clave === clave ? resultado.pagina : null

    return {
        notificaciones: actual?.contenido ?? [],
        totalElementos: actual?.totalElementos ?? 0,
        cargando: actual === null,
        recargar: () => setVersion((previa) => previa + 1),
        marcarLocal,
    }
}
