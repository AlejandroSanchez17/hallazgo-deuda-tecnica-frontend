import type { Alcance } from '../../types/usuario.types'

export type FiltroEstado = 'activos' | 'inactivos' | 'todos'

export interface RegistroActivable {
    id: number
    nombre: string
    activo: boolean
}

export interface TextosRegistro {
    sustantivo: string
    articulo: 'el' | 'la'
    femenino: boolean
}

export interface RolResponse extends RegistroActivable {
    codigo: string
    descripcion: string | null
    visibilidadGlobal: boolean
    cantidadPermisos: number
}

export interface PermisoDeRol {
    id: number
    codigo: string
    recurso: string
    accion: string
    descripcion: string | null
    alcance: Alcance
}

export interface RolDetalle extends RolResponse {
    permisos: PermisoDeRol[]
}

export interface RolRequest {
    nombre: string
    descripcion: string | null
    visibilidadGlobal: boolean
}

// Los formularios guardan texto; se convierte al tipo de la API al enviar
export interface RolFormulario {
    nombre: string
    descripcion: string
    visibilidadGlobal: boolean
}

export interface Permiso {
    id: number
    codigo: string
    recurso: string
    accion: string
    descripcion: string | null
}

export interface PermisoAsignado {
    permisoId: number
    alcance: Alcance
}

export interface PermisosRolRequest {
    permisos: PermisoAsignado[]
}
