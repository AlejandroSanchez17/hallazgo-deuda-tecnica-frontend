export type TipoDato = 'ENTERO' | 'DECIMAL' | 'BOOLEANO' | 'LISTA' | 'TEXTO'

export interface ParametroResponse {
    clave: string
    valor: string
    tipoDato: TipoDato
    descripcion: string
    modificadoPorId: number | null
    modificadoPorNombre: string | null
    fechaModificacion: string | null
}

// Rol activo que se ofrece en el selector de un parametro que guarda un rol
export interface RolActivo {
    id: number
    nombre: string
}

export interface GrupoParametros {
    titulo: string
    parametros: ParametroResponse[]
}
