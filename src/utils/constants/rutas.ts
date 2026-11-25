export const RUTAS = {
    inicio: '/',
    tablero: '/tablero',
    catalogos: '/catalogos',
    catalogosGerencias: '/catalogos/gerencias',
    catalogosAreas: '/catalogos/areas',
    catalogosOrigenes: '/catalogos/origenes',
    catalogosCategorias: '/catalogos/categorias-deuda',
    catalogosAplicaciones: '/catalogos/aplicaciones',
    catalogosCriticidades: '/catalogos/criticidades',
    parametros: '/parametros',
    bitacora: '/bitacora',
    bitacoraCambio: '/bitacora/:id',
    usuarios: '/usuarios',
    roles: '/roles',
    rolesListado: '/roles/listado',
    rolesPermisos: '/roles/permisos',
    equipos: '/equipos',
    equipoDetalle: '/equipos/:id',
    hallazgos: '/hallazgos',
    deudaTecnica: '/deuda-tecnica',
    // Lista combinada (la usa el tablero), detalle y plan; los dos tipos comparten estas pantallas
    elementos: '/elementos',
    elementoDetalle: '/elementos/:id',
    elementoPlan: '/elementos/:id/plan',
    elementoTarea: '/elementos/:id/plan/tareas/:tareaId',
    misTareas: '/mis-tareas',
    aprobaciones: '/aprobaciones',
    reportes: '/reportes',
    // Sin opcion en el menu: se entra desde la campana
    notificaciones: '/notificaciones',
    // Solo identifican grupos del menu; no son pantallas
    administracion: '/administracion',
    hallazgosYDeuda: '/hallazgos-y-deuda',
} as const

// Lista propia de cada tipo de elemento
export const rutaListaDe = (tipo: 'HALLAZGO' | 'DEUDA') => (tipo === 'HALLAZGO' ? RUTAS.hallazgos : RUTAS.deudaTecnica)

// La pestaña de permisos abre con el rol ya elegido
export const rutaPermisosDeRol = (rolId: number) => `${RUTAS.rolesPermisos}?rol=${rolId}`

export const rutaCambioBitacora = (cambioId: number) => `${RUTAS.bitacora}/${cambioId}`

export const rutaEquipo = (equipoId: number) => `${RUTAS.equipos}/${equipoId}`

// Listado con filtros iniciales (?semaforo=VENCIDO&equipo=6); los que vienen vacios no se ponen
export const rutaElementosFiltrados = (filtros: Record<string, string>) => {
    const parametros = new URLSearchParams(Object.entries(filtros).filter(([, valor]) => valor !== ''))
    const consulta = parametros.toString()
    return consulta === '' ? RUTAS.elementos : `${RUTAS.elementos}?${consulta}`
}

// Pantalla de reportes con el reporte y los filtros ya puestos (?reporte=REP-03&equipo=6); los vacios no se ponen
export const rutaReporte = (codigo: string, filtros: Record<string, string> = {}) => {
    const parametros = new URLSearchParams([
        ['reporte', codigo],
        ...Object.entries(filtros).filter(([, valor]) => valor !== ''),
    ])
    return `${RUTAS.reportes}?${parametros.toString()}`
}

export const rutaElemento = (elementoId: number) => `${RUTAS.elementos}/${elementoId}`

export const rutaPlanElemento = (elementoId: number) => `${rutaElemento(elementoId)}/plan`

// Parametros que leen la ficha (?pestana=) y el detalle de la tarea (?plan=, el plan de una version anterior); los
// usan las notificaciones
export const PARAMETRO_PESTANA = 'pestana'
export const PARAMETRO_PLAN = 'plan'

export const rutaPestanaElemento = (elementoId: number, pestana: string) =>
    `${rutaElemento(elementoId)}?${PARAMETRO_PESTANA}=${pestana}`

// Detalle de una tarea. Sin planId se busca en el plan vigente; con el, en esa version del plan
export const rutaTareaPlan = (elementoId: number, tareaId: number, planId?: number | null) => {
    const ruta = `${rutaPlanElemento(elementoId)}/tareas/${tareaId}`
    return planId ? `${ruta}?${PARAMETRO_PLAN}=${planId}` : ruta
}
