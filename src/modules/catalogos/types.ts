export type FiltroEstado = 'activos' | 'inactivos' | 'todos'

// undefined: formulario cerrado; null: registro nuevo
export type Edicion<T> = T | null | undefined

export interface RegistroCatalogo {
    id: number
    nombre: string
    activo: boolean
}

export interface TextosCatalogo {
    sustantivo: string
    articulo: 'el' | 'la'
    femenino: boolean
}

export type TipoArea = 'GERENCIA' | 'AREA'

// Una gerencia no tiene padre; un area depende de una gerencia; una subarea, de un area. gerenciaId y gerenciaNombre los
// calcula el backend (nulos en una gerencia y en un area antigua sin gerencia)
export interface AreaResponse extends RegistroCatalogo {
    tipo: TipoArea
    areaPadreId: number | null
    areaPadreNombre: string | null
    gerenciaId: number | null
    gerenciaNombre: string | null
}

export interface AreaRequest {
    nombre: string
    tipo: TipoArea
    areaPadreId: number | null
}

// Los formularios guardan texto; se convierte al tipo de la API al enviar
export interface AreaFormulario {
    nombre: string
    gerenciaId: string
    // Vacio: el area depende directamente de su gerencia
    areaSuperiorId: string
}

export interface GerenciaFormulario {
    nombre: string
}

export interface OrigenResponse extends RegistroCatalogo {
    descripcion: string | null
}

export interface OrigenRequest {
    nombre: string
    descripcion: string | null
}

export interface OrigenFormulario {
    nombre: string
    descripcion: string
}

export interface CategoriaResponse extends RegistroCatalogo {
    descripcion: string | null
    restringida: boolean
}

export interface CategoriaRequest {
    nombre: string
    descripcion: string | null
    restringida: boolean
}

export interface CategoriaFormulario {
    nombre: string
    descripcion: string
    restringida: boolean
}

export interface AplicacionResponse extends RegistroCatalogo {
    descripcion: string | null
    areaId: number
    areaNombre: string
}

export interface AplicacionRequest {
    nombre: string
    descripcion: string | null
    areaId: number | null
}

export interface AplicacionFormulario {
    nombre: string
    descripcion: string
    areaId: string
}

export interface RolResumen {
    id: number
    codigo: string
    nombre: string
}

export interface CriticidadResponse extends RegistroCatalogo {
    nivel: number
    plazoMeses: number
    maxProrrogas: number
    rolApruebaPlan: RolResumen
    rolValidaCierre: RolResumen
}

export interface CriticidadRequest {
    nombre: string
    plazoMeses: number | null
    maxProrrogas: number | null
    rolApruebaPlanId: number | null
    rolValidaCierreId: number | null
}

// El nivel solo se define al crear: el PUT no lo cambia
export interface NuevaCriticidadRequest extends CriticidadRequest {
    nivel: number | null
}

export interface CriticidadFormulario {
    nombre: string
    nivel: string
    plazoMeses: string
    maxProrrogas: string
    rolApruebaPlanId: string
    rolValidaCierreId: string
}
