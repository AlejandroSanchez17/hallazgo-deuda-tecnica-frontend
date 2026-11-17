import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { aErroresCampo, type ErroresCampo } from '../../../utils/erroresCampo'

// enviar llama a la API y devuelve el mensaje del backend, que se muestra en el aviso (trae el codigo del elemento)
export const useGuardar = (onGuardado: () => void) => {
    const [errores, setErrores] = useState<ErroresCampo>({})
    const [guardando, setGuardando] = useState(false)

    // erroresLocales impiden enviar. erroresConBackend se muestran junto con los del backend si este rechaza: el
    // backend revisa primero los campos (400) y solo despues las reglas (422), y asi se ven todos de una vez
    const guardar = async (
        enviar: () => Promise<string>,
        erroresLocales: ErroresCampo = {},
        erroresConBackend: ErroresCampo = {},
    ) => {
        if (Object.keys(erroresLocales).length > 0) {
            setErrores({ ...erroresConBackend, ...erroresLocales })
            return
        }
        setGuardando(true)
        setErrores({})
        try {
            void avisarExito(await enviar())
            onGuardado()
        } catch (error) {
            const errorApi = aErrorApi(error)
            // 409 y 422 traen el campo en errores: se marca en el formulario y ademas se avisa
            setErrores({ ...aErroresCampo(errorApi.errores), ...erroresConBackend })
            // Un 400 con campos ya se ve debajo de cada campo
            if (errorApi.estado !== 400 || errorApi.errores.length === 0) {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setGuardando(false)
        }
    }

    return { guardar, errores, guardando }
}
