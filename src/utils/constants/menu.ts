import type { Alcance } from '../../types/usuario.types'
import { PERMISOS, PERMISOS_BANDEJA } from './permisos'
import { RUTAS } from './rutas'

export interface OpcionMenu {
    ruta: string
    texto: string
    // Con una lista basta con tener uno de ellos
    permiso?: string | string[]
    // Si se indica, el permiso tiene que tenerlo con ese alcance
    alcance?: Alcance
    // Con hijos, la opcion se despliega en el menu en lugar de navegar; cada hijo es una pantalla o un subgrupo
    hijos?: OpcionMenu[]
    // Rutas de pantallas que no estan en el menu pero pertenecen al grupo: con ellas el grupo sale desplegado
    incluye?: string[]
}

// Agrupado como las pantallas del requerimiento (11.4); "Administración" reune los mantenimientos
export const OPCIONES_MENU: OpcionMenu[] = [
    // Sin Inicio: es el Tablero o Mis tareas, segun el rol, y los dos ya estan aqui. La miga Inicio lleva a /.
    // El tablero es gerencial: lideres y miembros tienen REPORTE:LEER con PROPIO (para sus reportes) y no lo ven
    { ruta: RUTAS.tablero, texto: 'Tablero', permiso: PERMISOS.reporteLeer, alcance: 'TODO' },
    // Solo quien puede ser responsable de una tarea (con el permiso de actualizar tareas). Va justo debajo del Tablero
    // porque es su pantalla de inicio: para ellos es la primera opcion del menu
    { ruta: RUTAS.misTareas, texto: 'Mis tareas', permiso: PERMISOS.tareaActualizar },
    {
        ruta: RUTAS.hallazgosYDeuda,
        texto: 'Hallazgos y deuda',
        permiso: PERMISOS.elementoLeer,
        // El detalle y el plan (/elementos/...) los comparten los dos tipos: el grupo sale desplegado ahi
        incluye: [RUTAS.elementos],
        hijos: [
            { ruta: RUTAS.hallazgos, texto: 'Hallazgos', permiso: PERMISOS.elementoLeer },
            { ruta: RUTAS.deudaTecnica, texto: 'Deuda técnica', permiso: PERMISOS.elementoLeer },
        ],
    },
    // Quien puede aprobar planes o prorrogas, o validar cierres: lo que le toca aprobar o validar
    { ruta: RUTAS.aprobaciones, texto: 'Aprobaciones', permiso: PERMISOS_BANDEJA },
    // A diferencia del Tablero, sin alcance: la ven todos los que leen reportes, líderes y miembros con sus equipos
    { ruta: RUTAS.reportes, texto: 'Reportes', permiso: PERMISOS.reporteLeer },
    {
        ruta: RUTAS.administracion,
        texto: 'Administración',
        hijos: [
            {
                ruta: RUTAS.catalogos,
                texto: 'Catálogos',
                permiso: PERMISOS.catalogoLeer,
                hijos: [
                    { ruta: RUTAS.catalogosGerencias, texto: 'Gerencias' },
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
            { ruta: RUTAS.bitacora, texto: 'Bitácora', permiso: PERMISOS.bitacoraLeer },
        ],
    },
]
