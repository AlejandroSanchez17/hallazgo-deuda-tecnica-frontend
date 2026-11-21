import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { guardarArchivo } from '../../../utils/descarga'
import { aErroresCampo, type ErroresCampo } from '../../../utils/erroresCampo'
import { reportesApi } from '../api'
import type { CodigoReporte, FormatoReporte } from '../types'

// Pide el archivo y lo guarda con el nombre del backend. Un error con campo (422 en hasta, formato o elementoId)
// queda en `errores` para marcarlo en pantalla; los demas (400, 404) salen como aviso, y el interceptor avisa 403 y 5xx
export const useGenerarReporte = () => {
    const [formatoEnCurso, setFormatoEnCurso] = useState<FormatoReporte | null>(null)
    const [errores, setErrores] = useState<ErroresCampo>({})

    const generar = async (codigo: CodigoReporte, formato: FormatoReporte, consulta: Record<string, string>) => {
        setFormatoEnCurso(formato)
        setErrores({})
        try {
            const { contenido, nombre } = await reportesApi.generar(codigo, formato, consulta)
            guardarArchivo(contenido, nombre)
        } catch (error) {
            const errorApi = aErrorApi(error)
            setErrores(aErroresCampo(errorApi.errores))
            // El mensaje del 422 tambien sale como aviso: el campo puede no estar a la vista
            avisarSiNoSeAviso(errorApi)
        } finally {
            setFormatoEnCurso(null)
        }
    }

    return { formatoEnCurso, errores, generar, limpiarErrores: () => setErrores({}) }
}
