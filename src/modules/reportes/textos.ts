import type { Opcion } from '../../utils/opciones'
import type { CampoFiltro, DefinicionReporte } from './types'

const COMUNES: CampoFiltro[] = ['estado', 'criticidad', 'origen', 'area', 'equipo', 'lider', 'aplicacion']
const CON_TIPO: CampoFiltro[] = ['tipo', ...COMUNES]

// Los de la tabla de BE-22: cuales filtros usa cada reporte y sobre que fecha se mide su periodo
export const REPORTES: DefinicionReporte[] = [
    {
        codigo: 'REP-01',
        nombre: 'Estado general de hallazgos de auditoría',
        descripcion: 'Siempre son hallazgos. El período se mide sobre la fecha de identificación.',
        filtros: COMUNES,
        periodo: 'fechas',
        soloPdf: false,
    },
    {
        codigo: 'REP-02',
        nombre: 'Inventario de deuda técnica',
        descripcion: 'Siempre es deuda técnica. El período se mide sobre la fecha de identificación.',
        filtros: COMUNES,
        periodo: 'fechas',
        soloPdf: false,
    },
    {
        codigo: 'REP-03',
        nombre: 'Elementos vencidos y próximos a vencer',
        descripcion: 'La foto de hoy: no usa el período.',
        filtros: CON_TIPO,
        periodo: 'ninguno',
        soloPdf: false,
    },
    {
        codigo: 'REP-04',
        nombre: 'Cumplimiento por equipo y líder técnico',
        descripcion: 'El período se mide sobre la fecha de cierre.',
        filtros: CON_TIPO,
        periodo: 'fechas',
        soloPdf: false,
    },
    {
        codigo: 'REP-05',
        nombre: 'Seguimiento detallado de plan de acción',
        descripcion: 'Se genera para un elemento; los demás filtros no se usan.',
        filtros: ['elemento'],
        periodo: 'ninguno',
        soloPdf: false,
    },
    {
        codigo: 'REP-06',
        nombre: 'Historial de prórrogas',
        descripcion: 'El período se mide sobre la fecha de solicitud de la prórroga.',
        filtros: CON_TIPO,
        periodo: 'fechas',
        soloPdf: false,
    },
    {
        codigo: 'REP-07',
        nombre: 'Carga de trabajo por persona',
        descripcion: 'No usa el período.',
        filtros: CON_TIPO,
        periodo: 'ninguno',
        soloPdf: false,
    },
    {
        codigo: 'REP-08',
        nombre: 'Antigüedad de elementos abiertos',
        descripcion: 'No usa el período.',
        filtros: CON_TIPO,
        periodo: 'ninguno',
        soloPdf: false,
    },
    {
        codigo: 'REP-10',
        nombre: 'Informe ejecutivo mensual',
        descripcion: 'Solo se genera en PDF, para un mes completo.',
        filtros: [],
        periodo: 'mes',
        soloPdf: true,
    },
]

export const definicionDe = (codigo: string | null | undefined) => REPORTES.find((reporte) => reporte.codigo === codigo)

export const OPCIONES_REPORTE: Opcion[] = REPORTES.map(({ codigo, nombre }) => ({
    valor: codigo,
    texto: `${codigo} · ${nombre}`,
}))

export const OPCIONES_TIPO: Opcion[] = [
    { valor: 'HALLAZGO', texto: 'Hallazgo' },
    { valor: 'DEUDA', texto: 'Deuda técnica' },
]

// En el orden del ciclo de vida
export const OPCIONES_ESTADO: Opcion[] = [
    { valor: 'REGISTRADO', texto: 'Registrado' },
    { valor: 'PLAN_EN_ELABORACION', texto: 'Plan en elaboración' },
    { valor: 'PLAN_EN_APROBACION', texto: 'Plan en aprobación' },
    { valor: 'EN_EJECUCION', texto: 'En ejecución' },
    { valor: 'CIERRE_SOLICITADO', texto: 'Cierre solicitado' },
    { valor: 'CERRADO', texto: 'Cerrado' },
    { valor: 'ANULADO', texto: 'Anulado' },
]

export const ETIQUETA_FILTRO: Record<CampoFiltro, string> = {
    tipo: 'Tipo',
    estado: 'Estado',
    criticidad: 'Criticidad',
    origen: 'Origen',
    area: 'Gerencia o área',
    equipo: 'Equipo',
    lider: 'Líder técnico',
    aplicacion: 'Aplicación',
    elemento: 'Elemento',
}
