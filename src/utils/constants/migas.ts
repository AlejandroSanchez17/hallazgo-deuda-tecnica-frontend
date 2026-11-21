import { RUTAS } from './rutas'

export interface Miga {
    texto: string
    // Sin ruta, la miga no navega: es la pagina actual o un grupo del menu sin pantalla propia (Administración).
    // Puede llevar los parametros de la pagina actual (/elementos/:id): MigasDePan los completa
    ruta?: string
}

const inicio: Miga = { texto: 'Inicio', ruta: RUTAS.inicio }
const administracion: Miga = { texto: 'Administración' }
const catalogos: Miga = { texto: 'Catálogos', ruta: RUTAS.catalogos }
const rolesYPermisos: Miga = { texto: 'Roles y permisos', ruta: RUTAS.roles }
const equipos: Miga = { texto: 'Equipos técnicos', ruta: RUTAS.equipos }

// Migas de cada pantalla por su ruta (admite parametros, como /equipos/:id); Inicio y la pagina 404 no tienen.
// Siguen los grupos del menu (utils/constants/menu.ts). Al agregar una pantalla se agrega su linea aqui
export const MIGAS: Record<string, Miga[]> = {
    [RUTAS.hallazgos]: [inicio, { texto: 'Hallazgos y deuda' }, { texto: 'Hallazgos' }],
    [RUTAS.deudaTecnica]: [inicio, { texto: 'Hallazgos y deuda' }, { texto: 'Deuda técnica' }],
    [RUTAS.elementos]: [inicio, { texto: 'Hallazgos y deuda' }],
    [RUTAS.elementoDetalle]: [
        inicio,
        { texto: 'Hallazgos y deuda', ruta: RUTAS.elementos },
        { texto: 'Detalle del elemento' },
    ],
    [RUTAS.elementoPlan]: [
        inicio,
        { texto: 'Hallazgos y deuda', ruta: RUTAS.elementos },
        { texto: 'Detalle del elemento', ruta: RUTAS.elementoDetalle },
        { texto: 'Plan de acción' },
    ],
    [RUTAS.elementoTarea]: [
        inicio,
        { texto: 'Hallazgos y deuda', ruta: RUTAS.elementos },
        { texto: 'Detalle del elemento', ruta: RUTAS.elementoDetalle },
        { texto: 'Plan de acción', ruta: RUTAS.elementoPlan },
        { texto: 'Tarea' },
    ],
    [RUTAS.tablero]: [inicio, { texto: 'Tablero' }],
    [RUTAS.misTareas]: [inicio, { texto: 'Mis tareas' }],
    [RUTAS.aprobaciones]: [inicio, { texto: 'Aprobaciones' }],
    [RUTAS.reportes]: [inicio, { texto: 'Reportes' }],
    [RUTAS.notificaciones]: [inicio, { texto: 'Notificaciones' }],
    [RUTAS.catalogosAreas]: [inicio, administracion, catalogos, { texto: 'Áreas' }],
    [RUTAS.catalogosOrigenes]: [inicio, administracion, catalogos, { texto: 'Orígenes' }],
    [RUTAS.catalogosCategorias]: [inicio, administracion, catalogos, { texto: 'Categorías de deuda' }],
    [RUTAS.catalogosAplicaciones]: [inicio, administracion, catalogos, { texto: 'Aplicaciones' }],
    [RUTAS.catalogosCriticidades]: [inicio, administracion, catalogos, { texto: 'Criticidades' }],
    [RUTAS.equipos]: [inicio, administracion, { texto: 'Equipos técnicos' }],
    [RUTAS.equipoDetalle]: [inicio, administracion, equipos, { texto: 'Detalle del equipo' }],
    [RUTAS.usuarios]: [inicio, administracion, { texto: 'Usuarios' }],
    [RUTAS.rolesListado]: [inicio, administracion, rolesYPermisos, { texto: 'Roles' }],
    [RUTAS.rolesPermisos]: [inicio, administracion, rolesYPermisos, { texto: 'Permisos' }],
    [RUTAS.parametros]: [inicio, administracion, { texto: 'Parámetros' }],
}
