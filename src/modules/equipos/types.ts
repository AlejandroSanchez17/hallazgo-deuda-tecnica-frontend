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

export interface EquipoResponse extends RegistroActivable {
    descripcion: string | null
    areaId: number
    areaNombre: string
    liderId: number | null
    liderNombre: string | null
    cantidadMiembros: number
    // Elementos del equipo que no estan cerrados ni anulados
    elementosAbiertos: number
}

export interface MiembroResponse {
    id: number
    usuarioId: number
    usuarioNombre: string
    usuarioRed: string
    // false si el usuario fue desactivado (en el historial, o si quedo en el equipo antes de esa regla)
    usuarioActivo: boolean
    esLider: boolean
    // 'AAAA-MM-DD'
    fechaIngreso: string
    fechaSalida: string | null
}

// GET /equipos/{id}: miembros vigentes, el lider primero
export interface EquipoDetalleResponse extends Omit<EquipoResponse, 'cantidadMiembros'> {
    miembros: MiembroResponse[]
}

export interface EquipoCrearRequest {
    nombre: string
    descripcion: string | null
    areaId: number | null
    liderId: number | null
}

export type EquipoActualizarRequest = Omit<EquipoCrearRequest, 'liderId'>

export interface LiderRequest {
    usuarioId: number | null
    fecha?: string
    // RF-EQP-05: pasar al nuevo lider los elementos abiertos del anterior (se pregunta, no es automatico)
    reasignarElementos?: boolean
}

export interface MiembroRequest {
    usuarioId: number | null
    fechaIngreso?: string
}

// Los formularios guardan texto; se convierte al tipo de la API al enviar
export interface EquipoFormulario {
    nombre: string
    descripcion: string
    areaId: string
    liderId: string
}

// Sirve para cambiar el lider y para agregar un miembro: un usuario y una fecha opcional
export interface UsuarioFechaFormulario {
    usuarioId: string
    fecha: Date | null
    reasignarElementos?: boolean
}

// Area que se ofrece en el combo (GET /catalogos/areas?activo=true)
export interface AreaDisponible {
    id: number
    nombre: string
}

// Usuario que se puede elegir como miembro o lider; el backend ya quita a los que tienen otro equipo y, para lider,
// solo manda a quienes tienen el rol Lider tecnico (los roles se cambian en Usuarios)
export interface CandidatoResponse {
    usuarioId: number
    nombre: string
    usuarioRed: string
}

// MIEMBRO: agregar miembro; LIDER: cambiar o asignar el lider; NUEVO_EQUIPO: lider al crear
export type ParaCandidatos = 'MIEMBRO' | 'LIDER' | 'NUEVO_EQUIPO'
