import { spacing } from '@hnba/design-tokens'
import { Table, Text, type TableColumn } from '@hnba/react-ui'
import { columna } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { TEXTO_ESTADO } from '../../textos'
import type { CambioEstadoResponse, ReasignacionResponse } from '../../types'

interface HistorialElementoProps {
    reasignaciones: ReasignacionResponse[]
    estados: CambioEstadoResponse[]
}

const SIN_CAMBIOS = 'Sin cambios registrados'

const fecha = { id: 'fecha', header: 'Fecha', align: 'center' } as const

// "Antes → Despues"; si no cambio, solo el valor
const cambio = (anterior: string | null, nuevo: string) =>
    anterior === null ? nuevo : anterior === nuevo ? nuevo : `${anterior} → ${nuevo}`

const columnasReasignacion: TableColumn<ReasignacionResponse>[] = [
    {
        ...fecha,
        render: (fila) => <span style={{ whiteSpace: 'nowrap' }}>{formatearFechaHora(fila.fecha)}</span>,
    },
    {
        id: 'equipo',
        header: 'Equipo',
        accessor: (fila) => cambio(fila.equipoAnteriorNombre, fila.equipoNuevoNombre),
    },
    { id: 'lider', header: 'Líder', accessor: (fila) => cambio(fila.liderAnteriorNombre, fila.liderNuevoNombre) },
    { id: 'motivo', header: 'Motivo', accessor: (fila) => fila.motivo },
    { id: 'usuario', header: 'Realizado por', accessor: (fila) => fila.usuarioNombre },
]

const columnasEstado: TableColumn<CambioEstadoResponse>[] = [
    {
        ...fecha,
        render: (fila) => <span style={{ whiteSpace: 'nowrap' }}>{formatearFechaHora(fila.fecha)}</span>,
    },
    {
        id: 'estado',
        header: 'Estado',
        accessor: (fila) =>
            cambio(fila.estadoAnterior && TEXTO_ESTADO[fila.estadoAnterior], TEXTO_ESTADO[fila.estadoNuevo]),
    },
    { id: 'motivo', header: 'Motivo', accessor: (fila) => fila.motivo ?? '—' },
    { id: 'usuario', header: 'Realizado por', accessor: (fila) => fila.usuarioNombre },
]

const titulo = (texto: string) => (
    <Text variant="h6" as="h2" style={{ margin: 0 }}>
        {texto}
    </Text>
)

// Pestana "Historial": reasignaciones y cambios de estado, el mas reciente primero
export const HistorialElemento = ({ reasignaciones, estados }: HistorialElementoProps) => (
    <div style={columna(spacing.lg)}>
        <div style={columna(spacing.sm)}>
            {titulo('Reasignaciones')}
            <Table
                columns={columnasReasignacion}
                rows={reasignaciones}
                getRowKey={(fila) => String(fila.id)}
                emptyText={SIN_CAMBIOS}
            />
        </div>
        <div style={columna(spacing.sm)}>
            {titulo('Cambios de estado')}
            <Table
                columns={columnasEstado}
                rows={estados}
                getRowKey={(fila) => String(fila.id)}
                emptyText={SIN_CAMBIOS}
            />
        </div>
    </div>
)
