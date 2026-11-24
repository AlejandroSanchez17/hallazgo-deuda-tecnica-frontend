import { useNavegacion } from '../../../hooks/useNavegacion'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { useNotificacionesStore } from '../../../store/notificacionesStore'
import { notificacionesApi } from '../api'
import { rutaDestino } from '../destinos'
import type { NotificacionResponse } from '../types'

interface AbrirNotificacionOpciones {
    // La lista pinta la notificacion como leida sin volver a pedirse
    onMarcada: (actualizada: NotificacionResponse) => void
    // El panel se cierra antes de navegar
    onNavegar?: () => void
}

// Al abrirla se marca como leida y se va a su destino (la ficha, una pestana, el plan o una tarea). Si la pagina
// responde 403 (por ejemplo, el elemento paso a otro equipo) el interceptor muestra el aviso de siempre
export const useAbrirNotificacion = ({ onMarcada, onNavegar }: AbrirNotificacionOpciones) => {
    const pedirRefresco = useNotificacionesStore((estado) => estado.pedirRefresco)
    const { ir } = useNavegacion()

    const abrir = async (notificacion: NotificacionResponse) => {
        if (!notificacion.leida) {
            try {
                onMarcada(await notificacionesApi.marcarLeida(notificacion.id))
                pedirRefresco()
            } catch (causa) {
                avisarSiNoSeAviso(aErrorApi(causa))
            }
        }
        const ruta = rutaDestino(notificacion)
        if (ruta !== null) {
            onNavegar?.()
            ir(ruta)
        }
    }

    return (notificacion: NotificacionResponse) => void abrir(notificacion)
}
