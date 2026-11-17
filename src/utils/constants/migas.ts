import { RUTAS } from './rutas'

export interface Miga {
    texto: string
    // Sin ruta, la miga no navega: es la pagina actual o un grupo del menu sin pantalla propia (Administración)
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
    [RUTAS.elementos]: [inicio, { texto: 'Hallazgos y deuda' }],
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
