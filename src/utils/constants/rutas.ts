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
    // Solo identifica el grupo del menu; no es una pantalla
    administracion: '/administracion',
} as const

// La pestaña de permisos abre con el rol ya elegido
export const rutaPermisosDeRol = (rolId: number) => `${RUTAS.rolesPermisos}?rol=${rolId}`

export const rutaEquipo = (equipoId: number) => `${RUTAS.equipos}/${equipoId}`

export const rutaElemento = (elementoId: number) => `${RUTAS.elementos}/${elementoId}`

export const rutaPlanElemento = (elementoId: number) => `${rutaElemento(elementoId)}/plan`
