export type Alcance = 'TODO' | 'PROPIO'

export interface Rol {
    id: number
    // Los roles creados desde el sistema no tienen codigo: no se decide nada por el, se usan los permisos
    codigo: string | null
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
