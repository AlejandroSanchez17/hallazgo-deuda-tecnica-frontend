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

export interface GrupoParametros {
    titulo: string
    parametros: ParametroResponse[]
}
