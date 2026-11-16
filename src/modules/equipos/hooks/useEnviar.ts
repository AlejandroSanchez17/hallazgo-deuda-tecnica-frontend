import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { aErroresCampo, type ErroresCampo } from '../../../utils/erroresCampo'

// Para los formularios que no crean ni editan el equipo (cambiar el lider, agregar un miembro)
export const useEnviar = <F>(enviar: (formulario: F) => Promise<unknown>, mensaje: string, onEnviado: () => void) => {
    const [errores, setErrores] = useState<ErroresCampo>({})
    const [enviando, setEnviando] = useState(false)

    const ejecutar = async (formulario: F) => {
        setEnviando(true)
        setErrores({})
        try {
            await enviar(formulario)
            void avisarExito(mensaje)
            onEnviado()
        } catch (error) {
            const errorApi = aErrorApi(error)
            // 409 y 422 traen el campo en errores: se marca en el formulario y ademas se avisa
            setErrores(aErroresCampo(errorApi.errores))
            // Un 400 con campos ya se ve debajo de cada campo
            if (errorApi.estado !== 400 || errorApi.errores.length === 0) {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setEnviando(false)
        }
    }

    return { ejecutar, errores, enviando }
}
