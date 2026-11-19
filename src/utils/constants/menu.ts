import { PERMISOS, PERMISOS_BANDEJA } from './permisos'
import { RUTAS } from './rutas'

export interface OpcionMenu {
    ruta: string
    texto: string
    // Con una lista basta con tener uno de ellos
    permiso?: string | string[]
    // Con hijos, la opcion se despliega en el menu en lugar de navegar; cada hijo es una pantalla o un subgrupo
    hijos?: OpcionMenu[]
}

// Agrupado como las pantallas del requerimiento (11.4); "Administración" reune los mantenimientos
export const OPCIONES_MENU: OpcionMenu[] = [
    { ruta: RUTAS.inicio, texto: 'Inicio' },
    { ruta: RUTAS.elementos, texto: 'Hallazgos y deuda', permiso: PERMISOS.elementoLeer },
    // Solo quien puede ser responsable de una tarea (Lider tecnico y Miembro de equipo)
    { ruta: RUTAS.misTareas, texto: 'Mis tareas', permiso: PERMISOS.tareaActualizar },
    // Gerencia de TI, Registrador y Auditor: lo que les toca aprobar o validar
    { ruta: RUTAS.aprobaciones, texto: 'Aprobaciones', permiso: PERMISOS_BANDEJA },
    {
        ruta: RUTAS.administracion,
        texto: 'Administración',
        hijos: [
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
            { ruta: RUTAS.equipos, texto: 'Equipos técnicos', permiso: PERMISOS.equipoLeer },
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
        ],
    },
]
