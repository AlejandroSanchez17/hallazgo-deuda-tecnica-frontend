import { Badge, type TableColumn } from '@hnba/react-ui'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { formatearFecha } from '../../utils/formato'
import { textoDias } from './textos'
import { ESTADO_TAREA } from './textosPlan'
import type { MiTarea } from './typesPlan'

// Solo para ubicar la tarea: cual es, de que elemento, para cuando y como va. El resto (inicio, peso, avance, ultimo
// avance, evidencias) y el registro del avance estan en su detalle (boton Ver). El plazo lo calcula el backend
export const COLUMNAS_MIS_TAREAS: TableColumn<MiTarea>[] = [
    { id: 'tarea', header: 'Tarea', render: (tarea) => <TextoCorto texto={tarea.titulo} ancho={280} /> },
    { id: 'codigo', header: 'Código', render: (tarea) => <TextoSinCorte>{tarea.elementoCodigo}</TextoSinCorte> },
    { id: 'elemento', header: 'Elemento', render: (tarea) => <TextoCorto texto={tarea.elementoTitulo} ancho={320} /> },
    {
        id: 'fin',
        header: 'Fin',
        align: 'center',
        render: (tarea) => <TextoSinCorte>{formatearFecha(tarea.fechaFin)}</TextoSinCorte>,
    },
    {
        id: 'vencimiento',
        header: 'Vencimiento',
        align: 'center',
        render: (tarea) => (tarea.vencida ? <Badge status="error" label="Vencida" /> : '—'),
    },
    {
        id: 'plazo',
        header: 'Plazo',
        align: 'center',
        render: (tarea) => <TextoSinCorte>{textoDias(tarea.diasRestantes) || '—'}</TextoSinCorte>,
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
