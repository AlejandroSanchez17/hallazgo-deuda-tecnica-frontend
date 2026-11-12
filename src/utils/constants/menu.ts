import { PERMISOS } from './permisos'
import { RUTAS } from './rutas'

export interface OpcionMenu {
    ruta: string
    texto: string
    permiso?: string
}

export const OPCIONES_MENU: OpcionMenu[] = [
    { ruta: RUTAS.inicio, texto: 'Inicio' },
    { ruta: RUTAS.catalogos, texto: 'Catálogos', permiso: PERMISOS.catalogoLeer },
    { ruta: RUTAS.parametros, texto: 'Parámetros', permiso: PERMISOS.parametroLeer },
    ...(import.meta.env.DEV ? [{ ruta: RUTAS.componentes, texto: 'Componentes' }] : []),
]
