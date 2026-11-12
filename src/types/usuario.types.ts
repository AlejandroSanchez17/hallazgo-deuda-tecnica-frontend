export type Alcance = 'TODO' | 'PROPIO'

export interface Rol {
    codigo: string
    nombre: string
}

export interface Permiso {
    codigo: string
    alcance: Alcance
}

export interface UsuarioSimulable {
    id: number
    nombre: string
    usuarioRed: string
    roles: Rol[]
}

export interface UsuarioActual {
    id: number
    nombre: string
    correo: string
    usuarioRed: string
    visibilidadGlobal: boolean
    roles: Rol[]
    permisos: Permiso[]
}
