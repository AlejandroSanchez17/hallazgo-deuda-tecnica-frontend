import { useLocation, useNavigate } from 'react-router-dom'
import { origenDe, origenDesde } from '../utils/origen'

// Navegacion que recuerda de donde se viene (ver utils/origen.ts). Las pantallas desde las que se entra a un detalle
// usan ir() en vez de navigate(); el detalle usa origen y volver() en su boton Volver
export const useNavegacion = () => {
    const navegar = useNavigate()
    const ubicacion = useLocation()
    const origen = origenDe(ubicacion.state)

    // Navega a destino dejando la pantalla actual como origen (si es una de las conocidas). datos viaja en el estado de
    // la navegacion, para una pantalla que no puede pedirlos al backend
    const ir = (destino: string, datos?: Record<string, unknown>) => {
        const actual = origenDesde(ubicacion.pathname, ubicacion.search, origen)
        void navegar(destino, actual || datos ? { state: { ...datos, origen: actual } } : undefined)
    }

    // Vuelve al origen (recuperando el origen de ese origen) o, sin el, a la ruta de siempre
    const volver = (rutaPorDefecto: string) => {
        if (origen) {
            void navegar(origen.ruta, origen.anterior ? { state: { origen: origen.anterior } } : undefined)
        } else {
            void navegar(rutaPorDefecto)
        }
    }

    // Para setSearchParams de las pantallas que cambian sus filtros en la URL: reemplaza la entrada del historial sin
    // perder el origen (por defecto el estado de la navegacion se pierde)
    const reemplazar = { replace: true, state: ubicacion.state as unknown }

    return { origen, ir, volver, reemplazar }
}
