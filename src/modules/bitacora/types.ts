export type AccionBitacora =
    | 'CREAR'
    | 'MODIFICAR'
    | 'CAMBIAR_ESTADO'
    | 'APROBAR'
    | 'RECHAZAR'
    | 'ANULAR'
    | 'DESCARGAR_EVIDENCIA'
    | 'DESCARGAR_PAQUETE'
    | 'INICIAR_SESION'

// Los valores son objetos JSON libres: cada entidad guarda los campos que cambian
export type ValorBitacora = Record<string, unknown> | null

export interface RegistroBitacora {
    id: number
    // ISO en UTC
    fecha: string
    usuarioId: number | null
    usuarioNombre: string | null
    // Nombre de la tabla ('elemento', 'equipo_tecnico'…)
    entidad: string
    // 0 en los parametros: la clave va dentro del valor
    entidadId: number
    accion: AccionBitacora
    valorAnterior: ValorBitacora
    valorNuevo: ValorBitacora
    ip: string | null
}

// Pagina del backend: `pagina` empieza en 0
export interface PaginaBitacora {
    contenido: RegistroBitacora[]
    pagina: number
    tamano: number
    totalElementos: number
    totalPaginas: number
}

// Todos en texto, como los guardan la URL y los selectores; vacio es "sin filtro"
export interface FiltrosBitacora {
    entidad: string
    entidadId: string
    usuario: string
    accion: string
    // 'AAAA-MM-DD'
    desde: string
    hasta: string
}

export interface UsuarioCombo {
    id: number
    nombre: string
}
