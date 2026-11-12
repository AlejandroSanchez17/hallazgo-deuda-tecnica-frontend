import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito, confirmar } from '../../../utils/alertas'
import { mensajeExito } from '../textos'
import type { RegistroCatalogo, TextosCatalogo } from '../types'

export const useCambiarEstado = (
    cambiar: (id: number, activo: boolean) => Promise<unknown>,
    textos: TextosCatalogo,
    onCambiado: () => void,
) => {
    const cambiarEstado = async (registro: RegistroCatalogo) => {
        const activar = !registro.activo
        const confirmado = await confirmar(
            `¿${activar ? 'Activar' : 'Desactivar'} ${textos.articulo} ${textos.sustantivo} ${registro.nombre}?`,
        )
        if (!confirmado) {
            return
        }
        try {
            await cambiar(registro.id, activar)
            void avisarExito(mensajeExito(textos, activar ? 'activad' : 'desactivad'))
            onCambiado()
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        }
    }

    return { cambiarEstado }
}
