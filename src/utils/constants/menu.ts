import { PERMISOS } from './permisos'
import { RUTAS } from './rutas'

export interface OpcionMenu {
    ruta: string
    texto: string
    permiso?: string
    // Con hijos, la opcion se despliega en el menu en lugar de navegar; cada hijo es una pantalla
    hijos?: OpcionMenu[]
}

export const OPCIONES_MENU: OpcionMenu[] = [
    { ruta: RUTAS.inicio, texto: 'Inicio' },
    {
        ruta: RUTAS.catalogos,
        texto: 'Catálogos',
        permiso: PERMISOS.catalogoLeer,
        hijos: [
            { ruta: RUTAS.catalogosAreas, texto: 'Áreas' },
            { ruta: RUTAS.catalogosOrigenes, texto: 'Orígenes' },
            { ruta: RUTAS.catalogosCategorias, texto: 'Categorías de deuda' },
            { ruta: RUTAS.catalogosAplicaciones, texto: 'Aplicaciones' },
            { ruta: RUTAS.catalogosCriticidades, texto: 'Criticidades' },
        ],
    },
    { ruta: RUTAS.usuarios, texto: 'Usuarios', permiso: PERMISOS.usuarioLeer },
    {
        ruta: RUTAS.roles,
        texto: 'Roles y permisos',
        permiso: PERMISOS.usuarioLeer,
        hijos: [
            { ruta: RUTAS.rolesListado, texto: 'Roles' },
            { ruta: RUTAS.rolesPermisos, texto: 'Permisos' },
        ],
    },
    { ruta: RUTAS.parametros, texto: 'Parámetros', permiso: PERMISOS.parametroLeer },
]
