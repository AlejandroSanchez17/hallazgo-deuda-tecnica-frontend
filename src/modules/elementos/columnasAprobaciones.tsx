import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../utils/formato'
import { TEXTO_TIPO } from './textos'
import { textoEspera, TIPO_PENDIENTE } from './textosProrroga'
import type { PendienteResponse } from './typesProrroga'

const sinCorte = { whiteSpace: 'nowrap' } as const

const apilado = { ...columna(spacing.xs), alignItems: 'center' }

// Que se pide: la version del plan, el cambio de fecha de la prorroga o quien valida el cierre
const detalle = (fila: PendienteResponse) => {
    if (fila.tipo === 'PLAN') {
        return <span style={sinCorte}>Versión {fila.planVersion}</span>
    }
    if (fila.tipo === 'PRORROGA') {
        return (
            <div style={apilado}>
                <span style={sinCorte}>{formatearFecha(fila.fechaAnterior)}</span>
                <span style={sinCorte}>→ {formatearFecha(fila.fechaPropuesta)}</span>
                {fila.esAdicional && <Badge status="warning" label="Adicional" />}
            </div>
        )
    }
    return <span>Lo valida {fila.rolRequeridoNombre}</span>
}

export const COLUMNAS_APROBACIONES: TableColumn<PendienteResponse>[] = [
    {
        id: 'tipo',
        header: 'Tipo',
        align: 'center',
        render: (fila) => <Badge status={TIPO_PENDIENTE[fila.tipo].estado} label={TIPO_PENDIENTE[fila.tipo].texto} />,
    },
    {
        id: 'elemento',
        header: 'Elemento',
        render: (fila) => (
            <div style={{ ...columna(spacing.xs), minWidth: 160 }}>
                <span>
                    {fila.elementoCodigo} · {fila.elementoTitulo}
                </span>
                <small style={textoSecundario}>
                    {TEXTO_TIPO[fila.elementoTipo]} · {fila.criticidadNombre} · {fila.equipoNombre}
                </small>
            </div>
        ),
    },
    { id: 'detalle', header: 'Solicitud', align: 'center', render: detalle },
    {
        id: 'solicitante',
        header: 'Pedido por',
        render: (fila) => (
            <div style={columna(spacing.xs)}>
                <span>{fila.solicitanteNombre}</span>
                <small style={{ ...textoSecundario, ...sinCorte }}>{formatearFechaHora(fila.fechaSolicitud)}</small>
            </div>
        ),
    },
    {
        id: 'espera',
        header: 'Espera',
        align: 'center',
        render: (fila) => <span style={sinCorte}>{textoEspera(fila.diasEsperando)}</span>,
    },
]
