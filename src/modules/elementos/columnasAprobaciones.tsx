import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn } from '@hnba/react-ui'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { fila as filaFlex } from '../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../utils/formato'
import { textoEspera, TIPO_PENDIENTE } from './textosProrroga'
import type { PendienteResponse } from './typesProrroga'

// Que se pide: la version del plan, el cambio de fecha de la prorroga o quien valida el cierre
const detalle = (fila: PendienteResponse) => {
    if (fila.tipo === 'PLAN') {
        return <TextoSinCorte>Versión {fila.planVersion}</TextoSinCorte>
    }
    if (fila.tipo === 'PRORROGA') {
        return (
            <span style={{ ...filaFlex(spacing.sm), justifyContent: 'center', flexWrap: 'wrap' }}>
                <TextoSinCorte>
                    {formatearFecha(fila.fechaAnterior)} → {formatearFecha(fila.fechaPropuesta)}
                </TextoSinCorte>
                {fila.esAdicional && <Badge status="warning" label="Adicional" />}
            </span>
        )
    }
    return <TextoCorto texto={`Lo valida ${fila.rolRequeridoNombre}`} ancho={160} />
}

// Cada dato en su columna; los textos largos se cortan con puntos suspensivos y el completo sale al pasar el cursor.
// El tipo del elemento (hallazgo o deuda) no tiene columna: lo dice el prefijo del codigo (HA-, DT-)
export const COLUMNAS_APROBACIONES: TableColumn<PendienteResponse>[] = [
    {
        id: 'tipo',
        header: 'Tipo',
        align: 'center',
        render: (fila) => <Badge status={TIPO_PENDIENTE[fila.tipo].estado} label={TIPO_PENDIENTE[fila.tipo].texto} />,
    },
    { id: 'codigo', header: 'Código', render: (fila) => <TextoSinCorte>{fila.elementoCodigo}</TextoSinCorte> },
    {
        id: 'elemento',
        header: 'Elemento',
        render: (fila) => <TextoCorto texto={fila.elementoTitulo} ancho={220} />,
    },
    { id: 'criticidad', header: 'Criticidad', render: (fila) => fila.criticidadNombre },
    { id: 'equipo', header: 'Equipo', render: (fila) => <TextoCorto texto={fila.equipoNombre} ancho={140} /> },
    { id: 'detalle', header: 'Solicitud', align: 'center', render: detalle },
    {
        id: 'solicitante',
        header: 'Pedido por',
        render: (fila) => <TextoCorto texto={fila.solicitanteNombre} ancho={150} />,
    },
    {
        id: 'fechaSolicitud',
        header: 'Fecha del pedido',
        align: 'center',
        render: (fila) => <TextoSinCorte>{formatearFechaHora(fila.fechaSolicitud)}</TextoSinCorte>,
    },
    {
        id: 'espera',
        header: 'Espera',
        align: 'center',
        render: (fila) => <TextoSinCorte>{textoEspera(fila.diasEsperando)}</TextoSinCorte>,
    },
]
