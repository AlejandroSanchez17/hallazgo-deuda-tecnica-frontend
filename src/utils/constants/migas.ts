import { RUTAS } from './rutas'

export interface Miga {
    texto: string
    // Sin ruta, la miga es la pagina actual
    ruta?: string
}

const inicio: Miga = { texto: 'Inicio', ruta: RUTAS.inicio }
const catalogos: Miga = { texto: 'Catálogos', ruta: RUTAS.catalogos }
const rolesYPermisos: Miga = { texto: 'Roles y permisos', ruta: RUTAS.roles }

// Migas de cada pantalla; Inicio y la pagina 404 no tienen. Al agregar una pantalla se agrega su linea aqui
export const MIGAS: Record<string, Miga[]> = {
    [RUTAS.catalogosAreas]: [inicio, catalogos, { texto: 'Áreas' }],
    [RUTAS.catalogosOrigenes]: [inicio, catalogos, { texto: 'Orígenes' }],
    [RUTAS.catalogosCategorias]: [inicio, catalogos, { texto: 'Categorías de deuda' }],
    [RUTAS.catalogosAplicaciones]: [inicio, catalogos, { texto: 'Aplicaciones' }],
    [RUTAS.catalogosCriticidades]: [inicio, catalogos, { texto: 'Criticidades' }],
    [RUTAS.usuarios]: [inicio, { texto: 'Usuarios' }],
    [RUTAS.rolesListado]: [inicio, rolesYPermisos, { texto: 'Roles' }],
    [RUTAS.rolesPermisos]: [inicio, rolesYPermisos, { texto: 'Permisos' }],
    [RUTAS.parametros]: [inicio, { texto: 'Parámetros' }],
}
