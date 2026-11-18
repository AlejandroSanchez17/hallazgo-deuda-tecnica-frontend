import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn } from '@hnba/react-ui'
import { BarraAvance } from './components/BarraAvance/BarraAvance'
import { columna, textoSecundario } from '../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../utils/formato'
import { textoDias } from './textos'
import { ESTADO_TAREA, textoNumero } from './textosPlan'
import type { MiTarea } from './typesPlan'

const sinCorte = { whiteSpace: 'nowrap' } as const

const apilado = { ...columna(spacing.xs), alignItems: 'center' }

// Inicio, fin y plazo (lo calcula el backend) van en una columna, y el ultimo avance solo con la fecha, para que la
// tabla quepa a 1280 px
export const COLUMNAS_MIS_TAREAS: TableColumn<MiTarea>[] = [
    {
        id: 'tarea',
        header: 'Tarea',
        render: (tarea) => (
            <div style={{ ...columna(spacing.xs), minWidth: 160 }}>
                <span>{tarea.titulo}</span>
                <small style={textoSecundario}>
                    {tarea.elementoCodigo} · {tarea.elementoTitulo}
                </small>
            </div>
        ),
    },
    {
        id: 'fechas',
        header: 'Fechas',
        align: 'center',
        render: (tarea) => (
            <div style={apilado}>
                <span style={sinCorte}>{formatearFecha(tarea.fechaInicio)}</span>
                <span style={sinCorte}>al {formatearFecha(tarea.fechaFin)}</span>
                {tarea.vencida && <Badge status="error" label="Vencida" />}
                <small style={textoSecundario}>{textoDias(tarea.diasRestantes)}</small>
            </div>
        ),
    },
    { id: 'peso', header: 'Peso', align: 'center', accessor: (tarea) => textoNumero(tarea.peso) },
    {
        id: 'avance',
        header: 'Avance',
        align: 'center',
        render: (tarea) => <BarraAvance valor={tarea.avance} ancho={48} />,
    },
    {
        id: 'estado',
        header: 'Estado',
        align: 'center',
        render: (tarea) => (
            <Badge status={ESTADO_TAREA[tarea.estado].estado} label={ESTADO_TAREA[tarea.estado].texto} />
        ),
    },
    {
        id: 'ultimoAvance',
        header: 'Último avance',
        align: 'center',
        render: (tarea) =>
            tarea.ultimoAvanceFecha ? (
                <span style={sinCorte}>{formatearFechaHora(tarea.ultimoAvanceFecha).split(',')[0]}</span>
            ) : (
                'Sin avances'
            ),
    },
]
