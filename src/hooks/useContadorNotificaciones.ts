import { useEffect } from 'react'
import { consultarNoLeidas } from '../services/api/notificaciones'
import { useNotificacionesStore } from '../store/notificacionesStore'
import { useSesionStore } from '../store/sesionStore'

const INTERVALO_MS = 60_000

const pestanaVisible = () => document.visibilityState === 'visible'

// Se monta una sola vez (en el Header). Consulta al cambiar de usuario, cada minuto con la pestaña visible, al volver
// a la pestaña y cuando alguien pide un refresco (el interceptor despues de una accion, o el centro al marcar)
export const useContadorNotificaciones = () => {
    const usuarioId = useSesionStore((estado) => estado.usuarioSimuladoId)
    const solicitud = useNotificacionesStore((estado) => estado.solicitud)
    const guardarTotal = useNotificacionesStore((estado) => estado.guardarTotal)
    const pedirRefresco = useNotificacionesStore((estado) => estado.pedirRefresco)

    useEffect(() => {
        let vigente = true
        if (usuarioId === null) {
            guardarTotal(0)
            return
        }
        consultarNoLeidas()
            .then((total) => vigente && guardarTotal(total))
            // Si falla, la insignia conserva el ultimo valor; se reintenta en la siguiente consulta
            .catch(() => undefined)
        return () => {
            vigente = false
        }
    }, [usuarioId, solicitud, guardarTotal])

    useEffect(() => {
        const alCambiarVisibilidad = () => pestanaVisible() && pedirRefresco()
        const intervalo = window.setInterval(() => pestanaVisible() && pedirRefresco(), INTERVALO_MS)
        document.addEventListener('visibilitychange', alCambiarVisibilidad)
        return () => {
            window.clearInterval(intervalo)
            document.removeEventListener('visibilitychange', alCambiarVisibilidad)
        }
    }, [pedirRefresco])
}
