import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { actualizarParametro } from '../api'

export const useGuardarParametro = (onGuardado: () => void) => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [guardando, setGuardando] = useState(false)

    const guardar = async (clave: string, valor: string) => {
        setGuardando(true)
        setError(undefined)
        try {
            await actualizarParametro(clave, valor)
            void avisarExito('Parámetro actualizado')
            onGuardado()
        } catch (errorObtenido) {
            const errorApi = aErrorApi(errorObtenido)
            const errorValor = errorApi.errores.find((errorCampo) => errorCampo.campo === 'valor')
            setError(errorValor?.mensaje)
            // Un 400 con el campo ya se ve debajo del valor
            if (errorApi.estado !== 400 || !errorValor) {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setGuardando(false)
        }
    }

    return { guardar, error, guardando }
}
