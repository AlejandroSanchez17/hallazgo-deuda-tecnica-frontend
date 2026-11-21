export type CodigoReporte =
    'REP-01' | 'REP-02' | 'REP-03' | 'REP-04' | 'REP-05' | 'REP-06' | 'REP-07' | 'REP-08' | 'REP-10'

export type FormatoReporte = 'xlsx' | 'pdf'

// Filtros que un reporte puede usar; el periodo (desde, hasta o mes) va aparte
export type CampoFiltro =
    'tipo' | 'estado' | 'criticidad' | 'origen' | 'area' | 'equipo' | 'lider' | 'aplicacion' | 'elemento'

// Todos en texto, como los guardan la URL y los selectores; vacio es "sin valor"
export interface FiltrosReporte extends Record<CampoFiltro, string> {
    reporte: CodigoReporte | ''
    // 'AAAA-MM-DD'
    desde: string
    hasta: string
    // 'AAAA-MM' (solo REP-10)
    mes: string
}

export interface DefinicionReporte {
    codigo: CodigoReporte
    nombre: string
    descripcion: string
    // Los filtros que el reporte usa: la pantalla no muestra ni manda los demas
    filtros: CampoFiltro[]
    // ninguno: el reporte no usa periodo; fechas: Desde y Hasta; mes: un mes completo
    periodo: 'ninguno' | 'fechas' | 'mes'
    soloPdf: boolean
}

// Lo que la pantalla toma de cada catalogo para sus combos
export interface RegistroCombo {
    id: number
    nombre: string
    activo?: boolean
}

export interface EquipoCombo extends RegistroCombo {
    liderId: number | null
    liderNombre: string | null
}

export interface ElementoCombo {
    id: number
    codigo: string
    titulo: string
}
