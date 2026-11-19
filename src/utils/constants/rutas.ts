export const RUTAS = {
    inicio: '/',
    catalogos: '/catalogos',
    catalogosAreas: '/catalogos/areas',
    catalogosOrigenes: '/catalogos/origenes',
    catalogosCategorias: '/catalogos/categorias-deuda',
    catalogosAplicaciones: '/catalogos/aplicaciones',
    catalogosCriticidades: '/catalogos/criticidades',
    parametros: '/parametros',
    usuarios: '/usuarios',
    roles: '/roles',
    rolesListado: '/roles/listado',
    rolesPermisos: '/roles/permisos',
    equipos: '/equipos',
    equipoDetalle: '/equipos/:id',
    elementos: '/elementos',
    elementoDetalle: '/elementos/:id',
    elementoPlan: '/elementos/:id/plan',
    misTareas: '/mis-tareas',
    aprobaciones: '/aprobaciones',
    // Sin opcion en el menu: se entra desde la campana
    notificaciones: '/notificaciones',
    // Solo identifica el grupo del menu; no es una pantalla
    administracion: '/administracion',
} as const

// La pestaña de permisos abre con el rol ya elegido
export const rutaPermisosDeRol = (rolId: number) => `${RUTAS.rolesPermisos}?rol=${rolId}`

export const rutaEquipo = (equipoId: number) => `${RUTAS.equipos}/${equipoId}`

export const rutaElemento = (elementoId: number) => `${RUTAS.elementos}/${elementoId}`

export const rutaPlanElemento = (elementoId: number) => `${rutaElemento(elementoId)}/plan`

// Parametros que leen la ficha (?pestana=) y la pagina del plan (?tarea=, abre Ver tarea); los usan las notificaciones
export const PARAMETRO_PESTANA = 'pestana'
export const PARAMETRO_TAREA = 'tarea'

export const rutaPestanaElemento = (elementoId: number, pestana: string) =>
    `${rutaElemento(elementoId)}?${PARAMETRO_PESTANA}=${pestana}`

export const rutaTareaPlan = (elementoId: number, tareaId: number) =>
    `${rutaPlanElemento(elementoId)}?${PARAMETRO_TAREA}=${tareaId}`
