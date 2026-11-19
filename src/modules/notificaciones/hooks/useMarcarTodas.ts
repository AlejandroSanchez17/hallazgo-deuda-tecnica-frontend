import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { useNotificacionesStore } from '../../../store/notificacionesStore'
import { avisarExito } from '../../../utils/alertas'
import { notificacionesApi } from '../api'

// El aviso es el mensaje del backend ("3 notificaciones marcadas como leídas")
export const useMarcarTodas = (onMarcadas: () => void) => {
    const pedirRefresco = useNotificacionesStore((estado) => estado.pedirRefresco)
    const [marcando, setMarcando] = useState(false)

    const marcar = async () => {
        setMarcando(true)
        try {
            void avisarExito(await notificacionesApi.marcarTodas())
            pedirRefresco()
            onMarcadas()
        } catch (causa) {
            avisarSiNoSeAviso(aErrorApi(causa))
        } finally {
            setMarcando(false)
        }
    }

    return { marcarTodas: () => void marcar(), marcando }
}
