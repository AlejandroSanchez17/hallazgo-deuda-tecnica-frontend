import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn } from '@hnba/react-ui'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { fila } from '../../styles/disposicion'
import { formatearFecha } from '../../utils/formato'
import { textoDias } from './textos'
import { ESTADO_TAREA } from './textosPlan'
import type { MiTarea } from './typesPlan'

// Codigo y fechas no se parten en dos lineas (las celdas saltan de linea por una regla global)
const sinCorte = { whiteSpace: 'nowrap' } as const

// Solo para ubicar la tarea: cual es, de que elemento, para cuando y como va. El resto (inicio, peso, avance, ultimo
// avance, evidencias) y el registro del avance estan en su detalle (boton Ver). El plazo lo calcula el backend
export const COLUMNAS_MIS_TAREAS: TableColumn<MiTarea>[] = [
    { id: 'tarea', header: 'Tarea', render: (tarea) => <TextoCorto texto={tarea.titulo} ancho={280} /> },
    { id: 'codigo', header: 'Código', render: (tarea) => <span style={sinCorte}>{tarea.elementoCodigo}</span> },
    { id: 'elemento', header: 'Elemento', render: (tarea) => <TextoCorto texto={tarea.elementoTitulo} ancho={320} /> },
    {
        id: 'fin',
        header: 'Fin',
        align: 'center',
        render: (tarea) => <span style={sinCorte}>{formatearFecha(tarea.fechaFin)}</span>,
    },
    {
        id: 'plazo',
        header: 'Plazo',
        align: 'center',
        render: (tarea) => (
            <div style={{ ...fila(spacing.xs), justifyContent: 'center' }}>
                {tarea.vencida && <Badge status="error" label="Vencida" />}
                <span style={sinCorte}>{textoDias(tarea.diasRestantes)}</span>
            </div>
        ),
    },
    {
        id: 'estado',
        header: 'Estado',
        align: 'center',
        render: (tarea) => (
            <Badge status={ESTADO_TAREA[tarea.estado].estado} label={ESTADO_TAREA[tarea.estado].texto} />
        ),
    },
]
