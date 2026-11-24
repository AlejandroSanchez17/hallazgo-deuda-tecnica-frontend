import { Badge, type TableColumn } from '@hnba/react-ui'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { formatearFecha, formatearFechaHora } from '../../utils/formato'
import { ESTADO_PRORROGA, RESULTADO_CIERRE } from './textosProrroga'
import type { CierreResponse, ProrrogaResponse } from './typesProrroga'

// Texto largo en una linea; el completo, arriba al pasar el cursor
const recortado = (texto: string | null) => <TextoCorto texto={texto} ancho={240} />

// Cada dato en su columna (las fechas, quien pidio, quien resolvio y el comentario); sin resolver, las columnas de la
// resolucion muestran "—"
const COLUMNAS_PRORROGAS: TableColumn<ProrrogaResponse>[] = [
    {
        id: 'fechaAnterior',
        header: 'Fecha anterior',
        align: 'center',
        render: (prorroga) => <TextoSinCorte>{formatearFecha(prorroga.fechaAnterior)}</TextoSinCorte>,
    },
    {
        id: 'fechaPropuesta',
        header: 'Fecha propuesta',
        align: 'center',
        render: (prorroga) => <TextoSinCorte>{formatearFecha(prorroga.fechaPropuesta)}</TextoSinCorte>,
    },
    { id: 'justificacion', header: 'Justificación', render: (prorroga) => recortado(prorroga.justificacion) },
    {
        id: 'estado',
        header: 'Estado',
        align: 'center',
        render: (prorroga) => (
            <Badge status={ESTADO_PRORROGA[prorroga.estado].estado} label={ESTADO_PRORROGA[prorroga.estado].texto} />
        ),
    },
    // Solo las que superan el maximo de la criticidad llevan la marca; las demas, "—"
    {
        id: 'adicional',
        header: 'Adicional',
        align: 'center',
        render: (prorroga) => (prorroga.esAdicional ? <Badge status="warning" label="Adicional" /> : '—'),
    },
    {
        id: 'solicitante',
        header: 'Pedida por',
        render: (prorroga) => <TextoCorto texto={prorroga.solicitanteNombre} ancho={180} />,
    },
    {
        id: 'fechaSolicitud',
        header: 'Fecha del pedido',
        align: 'center',
        render: (prorroga) => <TextoSinCorte>{formatearFechaHora(prorroga.fechaSolicitud)}</TextoSinCorte>,
    },
    {
        id: 'resolutor',
        header: 'Resuelta por',
        render: (prorroga) => <TextoCorto texto={prorroga.resolutorNombre} ancho={180} />,
    },
    {
        id: 'fechaResolucion',
        header: 'Fecha de resolución',
        align: 'center',
        render: (prorroga) => <TextoSinCorte>{formatearFechaHora(prorroga.fechaResolucion)}</TextoSinCorte>,
    },
    {
        id: 'comentario',
        header: 'Comentario',
        render: (prorroga) => recortado(prorroga.comentarioResolucion),
    },
]

// La columna Adicional solo se dibuja si alguna prorroga del historial supera el maximo de su criticidad
export const columnasProrrogas = (prorrogas: ProrrogaResponse[]) =>
    prorrogas.some((prorroga) => prorroga.esAdicional)
        ? COLUMNAS_PRORROGAS
        : COLUMNAS_PRORROGAS.filter((columna) => columna.id !== 'adicional')

export const COLUMNAS_CIERRES: TableColumn<CierreResponse>[] = [
    {
        id: 'resultado',
        header: 'Resultado',
        align: 'center',
        render: (cierre) => (
            <Badge
                status={RESULTADO_CIERRE[cierre.resultado].estado}
                label={RESULTADO_CIERRE[cierre.resultado].texto}
            />
        ),
    },
    { id: 'rol', header: 'Lo valida', accessor: (cierre) => cierre.rolRequeridoNombre },
    {
        id: 'plan',
        header: 'Plan',
        align: 'center',
        render: (cierre) => (
            <TextoSinCorte>{cierre.planVersion === null ? '—' : `Versión ${cierre.planVersion}`}</TextoSinCorte>
        ),
    },
    // Cada dato en su columna (quien, cuando y el comentario); los textos largos se cortan con tooltip. Sin resolver,
    // las columnas de la resolucion muestran "—"
    {
        id: 'solicitante',
        header: 'Pedido por',
        render: (cierre) => <TextoCorto texto={cierre.solicitanteNombre} ancho={180} />,
    },
    {
        id: 'fechaSolicitud',
        header: 'Fecha del pedido',
        align: 'center',
        render: (cierre) => <TextoSinCorte>{formatearFechaHora(cierre.fechaSolicitud)}</TextoSinCorte>,
    },
    {
        id: 'resolutor',
        header: 'Resuelto por',
        render: (cierre) => <TextoCorto texto={cierre.resolutorNombre} ancho={180} />,
    },
    {
        id: 'fechaResolucion',
        header: 'Fecha de resolución',
        align: 'center',
        render: (cierre) => <TextoSinCorte>{formatearFechaHora(cierre.fechaResolucion)}</TextoSinCorte>,
    },
    { id: 'comentario', header: 'Comentario', render: (cierre) => recortado(cierre.comentario) },
]
