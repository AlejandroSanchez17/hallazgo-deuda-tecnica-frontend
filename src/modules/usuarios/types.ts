export type FiltroEstado = 'activos' | 'inactivos' | 'todos'

// undefined: formulario cerrado; null: registro nuevo
export type Edicion<T> = T | null | undefined

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

export interface RolDeUsuario {
    id: number
    codigo: string
    nombre: string
    activo: boolean
}

// Rol que se ofrece en el formulario (GET /roles?activo=true)
export interface RolDisponible {
    id: number
    nombre: string
}

export interface UsuarioResponse extends RegistroActivable {
    correo: string
    usuarioRed: string
    fechaCreacion: string
    ultimoAcceso: string | null
    roles: RolDeUsuario[]
}

export interface UsuarioRequest {
    nombre: string
    correo: string
    usuarioRed: string
    rolIds: number[]
}

// Los formularios guardan texto; se convierte al tipo de la API al enviar
export interface UsuarioFormulario {
    nombre: string
    correo: string
    usuarioRed: string
    rolIds: string[]
}
