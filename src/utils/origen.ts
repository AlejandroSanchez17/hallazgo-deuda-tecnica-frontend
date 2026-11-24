import { matchPath } from 'react-router-dom'
import { RUTAS } from './constants/rutas'

// Desde donde llego el usuario a una pantalla de detalle (la bandeja de Aprobaciones, Mis tareas, una lista, el plan…).
// Viaja en el estado de la navegacion, no en la URL, y el boton Volver de la pantalla regresa ahi y no a la pantalla
// de siempre. "anterior" es el origen de esa pantalla: al volver se recupera, asi la cadena
// Aprobaciones → plan → tarea se deshace paso a paso (tarea → plan → Aprobaciones)
export interface Origen {
    // Ruta con su consulta (?pestana=, ?semaforo=…), para volver a la pantalla tal como estaba
    ruta: string
    // Texto del boton: "Volver a aprobaciones"
    etiqueta: string
    anterior: Origen | null
}

// Las pantallas desde las que se puede llegar a un detalle, con el texto del boton Volver. Una pantalla que no esta
// aqui no se recuerda como origen (el detalle usa su regreso de siempre)
const ETIQUETAS: { patron: string; etiqueta: string }[] = [
    { patron: RUTAS.aprobaciones, etiqueta: 'Volver a aprobaciones' },
    { patron: RUTAS.misTareas, etiqueta: 'Volver a mis tareas' },
    { patron: RUTAS.tablero, etiqueta: 'Volver al tablero' },
    { patron: RUTAS.notificaciones, etiqueta: 'Volver a notificaciones' },
    { patron: RUTAS.hallazgos, etiqueta: 'Volver a hallazgos' },
    { patron: RUTAS.deudaTecnica, etiqueta: 'Volver a deuda técnica' },
    { patron: RUTAS.elementos, etiqueta: 'Volver a hallazgos y deuda' },
    { patron: RUTAS.elementoDetalle, etiqueta: 'Volver al elemento' },
    { patron: RUTAS.elementoPlan, etiqueta: 'Volver al plan' },
    { patron: RUTAS.elementoTarea, etiqueta: 'Volver a la tarea' },
    { patron: RUTAS.equipos, etiqueta: 'Volver a equipos' },
    { patron: RUTAS.bitacora, etiqueta: 'Volver a la bitácora' },
]

// El origen que deja la pantalla actual al navegar a otra: ella misma, recordando de donde venia
export const origenDesde = (pathname: string, consulta: string, anterior: Origen | null): Origen | null => {
    const encontrada = ETIQUETAS.find(({ patron }) => matchPath({ path: patron, end: true }, pathname))
    return encontrada ? { ruta: `${pathname}${consulta}`, etiqueta: encontrada.etiqueta, anterior } : null
}

const esOrigen = (valor: unknown): valor is Origen => {
    const origen = valor as Partial<Origen> | null
    return typeof origen?.ruta === 'string' && typeof origen.etiqueta === 'string'
}

// El origen guardado en el estado de la navegacion, o null si se llego de la forma habitual
export const origenDe = (estado: unknown): Origen | null => {
    const origen = (estado as { origen?: unknown } | null)?.origen
    return esOrigen(origen) ? { ...origen, anterior: origenDe({ origen: origen.anterior }) } : null
}
