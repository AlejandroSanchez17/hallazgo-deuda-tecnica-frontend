export type TipoElemento = 'HALLAZGO' | 'DEUDA'

// valor es un porcentaje con un decimal; null cuando el denominador es 0
export interface Indicador {
    valor: number | null
    numerador: number
    denominador: number
}

export interface ResumenTablero {
    abiertos: number
    vencidos: number
    enRiesgo: number
    enTiempo: number
    cerradosPeriodo: number
}

export interface AbiertosCriticidad {
    tipo: TipoElemento
    criticidadId: number
    criticidad: string
    nivel: number
    abiertos: number
}

export interface CierrePorCriticidad {
    criticidadId: number
    criticidad: string
    nivel: number
    cerrados: number
    promedioDias: number | null
}

export interface DeudaAplicacion {
    // null es "Sin aplicación"
    aplicacionId: number | null
    aplicacion: string | null
    horas: number
    elementos: number
}

export interface MesTendencia {
    // 'AAAA-MM'
    mes: string
    nuevos: number
    cerrados: number
}

export interface EquipoRanking {
    equipoId: number
    equipo: string
    vencidos: number
    abiertos: number
}

export interface TableroResponse {
    periodo: { desde: string; hasta: string }
    resumen: ResumenTablero
    abiertosPorTipoCriticidad: AbiertosCriticidad[]
    kpi: {
        cumplimientoPlazo: Indicador
        vencidos: Indicador
        tasaProrrogas: Indicador
        tasaReapertura: Indicador
    }
    tiempoPromedioCierre: {
        global: number | null
        cerrados: number
        porCriticidad: CierrePorCriticidad[]
    }
    deudaPendiente: {
        totalHoras: number
        elementos: number
        porAplicacion: DeudaAplicacion[]
    }
    tendencia: MesTendencia[]
    rankingEquipos: EquipoRanking[]
}

// Este año (por defecto), los ultimos 3, 6 o 12 meses, o fechas elegidas
export type OpcionPeriodo = 'anio' | 'tresMeses' | 'seisMeses' | 'doceMeses' | 'personalizado'

// desde y hasta ('AAAA-MM-DD') solo se usan con 'personalizado'; '' es sin fecha
export interface FiltrosTablero {
    periodo: OpcionPeriodo
    desde: string
    hasta: string
}
