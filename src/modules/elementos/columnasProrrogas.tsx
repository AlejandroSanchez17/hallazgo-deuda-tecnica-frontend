import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../utils/formato'
import { ESTADO_PRORROGA, RESULTADO_CIERRE } from './textosProrroga'
import type { CierreResponse, ProrrogaResponse } from './typesProrroga'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'

const sinCorte = { whiteSpace: 'nowrap' } as const

const apilado = { ...columna(spacing.xs), alignItems: 'center' }

// Texto largo en una linea; el completo, arriba al pasar el cursor
const recortado = (texto: string | null) => <TextoCorto texto={texto} ancho={240} />

// Nombre y, debajo, la fecha y hora y el comentario de quien resolvio; sin nombre (todavia sin resolver), "—".
// El comentario no va en su propia columna para que la tabla quepa a 1280 px con las acciones
const quienYCuando = (nombre: string | null, fecha: string | null, comentario?: string | null) =>
    nombre ? (
        <div style={columna(spacing.xs)}>
            <TextoCorto texto={nombre} ancho={180} />
            <small style={{ ...textoSecundario, ...sinCorte }}>{formatearFechaHora(fecha)}</small>
            {comentario && <small>{recortado(comentario)}</small>}
        </div>
    ) : (
        '—'
    )

export const COLUMNAS_PRORROGAS: TableColumn<ProrrogaResponse>[] = [
    {
        id: 'fechas',
        header: 'Fecha compromiso',
        align: 'center',
        render: (prorroga) => (
            <div style={apilado}>
                <span style={sinCorte}>{formatearFecha(prorroga.fechaAnterior)}</span>
                <span style={sinCorte}>→ {formatearFecha(prorroga.fechaPropuesta)}</span>
                {prorroga.esAdicional && <Badge status="warning" label="Adicional" />}
            </div>
        ),
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
    {
        id: 'solicitante',
        header: 'Pedida por',
        render: (prorroga) => quienYCuando(prorroga.solicitanteNombre, prorroga.fechaSolicitud),
    },
    {
        id: 'resolutor',
        header: 'Resuelta por',
        render: (prorroga) =>
            quienYCuando(prorroga.resolutorNombre, prorroga.fechaResolucion, prorroga.comentarioResolucion),
    },
]

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
            <span style={sinCorte}>{cierre.planVersion === null ? '—' : `Versión ${cierre.planVersion}`}</span>
        ),
    },
    {
        id: 'solicitante',
        header: 'Pedido por',
        render: (cierre) => quienYCuando(cierre.solicitanteNombre, cierre.fechaSolicitud),
    },
    {
        id: 'resolutor',
        header: 'Resuelto por',
        render: (cierre) => quienYCuando(cierre.resolutorNombre, cierre.fechaResolucion, cierre.comentario),
    },
]
