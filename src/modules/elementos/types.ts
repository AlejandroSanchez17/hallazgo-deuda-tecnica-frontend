export type TipoElemento = 'HALLAZGO' | 'DEUDA'

export type EstadoElemento =
    | 'REGISTRADO'
    | 'PLAN_EN_ELABORACION'
    | 'PLAN_EN_APROBACION'
    | 'EN_EJECUCION'
    | 'CIERRE_SOLICITADO'
    | 'CERRADO'
    | 'ANULADO'

// Lo calcula la base (v_elemento_semaforo); null si el elemento esta cerrado o anulado
export type Semaforo = 'VENCIDO' | 'EN_RIESGO' | 'EN_TIEMPO'

export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL'

// Fila de GET /elementos (lista completa, del mas reciente al mas antiguo)
export interface ElementoResponse {
    id: number
    codigo: string
    tipo: TipoElemento
    titulo: string
    criticidadId: number
    criticidadNombre: string
    // 1 Critica … 4 Baja
    criticidadNivel: number
    estado: EstadoElemento
    equipoId: number
    equipoNombre: string
    liderId: number | null
    liderNombre: string | null
    origenId: number
    origenNombre: string
    // 'AAAA-MM-DD'
    fechaIdentificacion: string
    fechaCompromisoVigente: string
    semaforo: Semaforo | null
    // Negativo si ya vencio
    diasRestantes: number | null
}

export interface DatosHallazgo {
    referenciaInforme: string
    enteEmisor: string
    recomendacion: string
    riesgoAsociado: string
}

export interface DatosDeuda {
    categoriaDeudaId: number | null
    causa: string
    impactoTecnico: string
    impactoNegocio: string
    esfuerzoHoras: number | null
    talla: Talla | null
    componente: string
}

export interface DeudaResponse extends DatosDeuda {
    categoriaDeudaNombre: string
    restringida: boolean
}

export interface AplicacionDelElemento {
    id: number
    nombre: string
}

// GET /elementos/{id}: el bloque del otro tipo llega en null
export interface ElementoDetalleResponse extends ElementoResponse {
    descripcion: string
    registradorId: number
    registradorNombre: string
    fechaCompromisoSugerida: string
    fechaCompromisoOriginal: string
    justificacionFecha: string | null
    fechaCierre: string | null
    motivoAnulacion: string | null
    fechaRegistro: string
    aplicaciones: AplicacionDelElemento[]
    hallazgo: DatosHallazgo | null
    deuda: DeudaResponse | null
    prorrogasAprobadas: number
    // Responsables de las tareas no canceladas del ultimo plan aprobado o finalizado, por nombre; [] si no hay
    participantes: ParticipanteResponse[]
}

export interface ParticipanteResponse {
    usuarioId: number
    nombre: string
}

// Se manda solo el bloque del tipo del elemento
export interface ElementoActualizarRequest {
    titulo: string
    descripcion: string
    origenId: number | null
    aplicacionIds: number[]
    hallazgo?: DatosHallazgo
    deuda?: DatosDeuda
}

export interface ElementoCrearRequest extends ElementoActualizarRequest {
    tipo: TipoElemento | null
    criticidadId: number | null
    equipoId: number | null
    fechaIdentificacion: string | null
    // Solo si el usuario cambio la fecha sugerida; entonces la justificacion es obligatoria
    fechaCompromisoOriginal?: string
    justificacionFecha?: string
}

// Los formularios guardan texto; las fechas como 'AAAA-MM-DD' ('' sin elegir)
export interface ElementoFormulario {
    tipo: TipoElemento | ''
    titulo: string
    descripcion: string
    origenId: string
    criticidadId: string
    equipoId: string
    fechaIdentificacion: string
    // '' mientras el usuario no la cambie: vale la sugerida
    fechaCompromiso: string
    justificacionFecha: string
    aplicacionIds: string[]
    referenciaInforme: string
    enteEmisor: string
    recomendacion: string
    riesgoAsociado: string
    categoriaDeudaId: string
    causa: string
    impactoTecnico: string
    impactoNegocio: string
    esfuerzoHoras: string
    talla: Talla | ''
    componente: string
}

// Combos del formulario
export interface RegistroDeCatalogo {
    id: number
    nombre: string
    activo: boolean
}

export interface CriticidadDisponible extends RegistroDeCatalogo {
    nivel: number
    plazoMeses: number
}

export interface CategoriaDisponible extends RegistroDeCatalogo {
    restringida: boolean
}

export interface EquipoDisponible extends RegistroDeCatalogo {
    liderId: number | null
}

// El lider no se manda: el backend asigna al lider vigente del equipo destino
export interface ReasignacionRequest {
    equipoId: number | null
    motivo: string
}

export interface ReasignacionFormulario {
    equipoId: string
    motivo: string
}

// GET /elementos/{id}/reasignaciones, la mas reciente primero; usuario es quien reasigno
export interface ReasignacionResponse {
    id: number
    // ISO con hora
    fecha: string
    equipoAnteriorId: number
    equipoAnteriorNombre: string
    equipoNuevoId: number
    equipoNuevoNombre: string
    liderAnteriorId: number
    liderAnteriorNombre: string
    liderNuevoId: number
    liderNuevoNombre: string
    motivo: string
    usuarioId: number
    usuarioNombre: string
}

// GET /elementos/{id}/estados, el mas reciente primero; el registro inicial trae estadoAnterior en null
export interface CambioEstadoResponse {
    id: number
    fecha: string
    estadoAnterior: EstadoElemento | null
    estadoNuevo: EstadoElemento
    motivo: string | null
    usuarioId: number
    usuarioNombre: string
}

// Solo lo que se lee de GET /equipos/{id} y /equipos/{id}/miembros para reasignar
export interface EquipoDelElemento {
    id: number
    nombre: string
    liderId: number | null
}

export interface MiembroDelEquipo {
    usuarioId: number
    usuarioNombre: string
    usuarioActivo: boolean
    esLider: boolean
}

// Solo lo que se lee de GET /parametros
export interface ParametroTalla {
    clave: string
    valor: string
}

// Una talla sin parametro (o con un valor que no es numero) no aparece
export type HorasPorTalla = Partial<Record<Talla, number>>

// undefined: formulario cerrado; null: elemento nuevo
export type Edicion<T> = T | null | undefined

// '' en cada filtro es "todos"
export interface FiltrosElementos {
    tipo: string
    estado: string
    criticidad: string
    equipo: string
    origen: string
    semaforo: string
}
