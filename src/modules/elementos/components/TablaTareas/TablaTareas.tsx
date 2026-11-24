import { spacing } from '@hnba/design-tokens'
import { Badge, Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { ESTADO_TAREA, textoNumero } from '../../textosPlan'
import type { PlanResponse, TareaResponse } from '../../typesPlan'
import { BarraAvance } from '../BarraAvance/BarraAvance'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../../../components/common/TextoSinCorte/TextoSinCorte'

interface TablaTareasProps {
    plan: PlanResponse
    // Ver la tarea completa, para todos (sobre todo para quien aprueba el plan)
    onVer: (tarea: TareaResponse) => void
    // Sin la funcion (sin permiso o fuera de su estado del plan) no se dibuja la columna
    onAvance?: (tarea: TareaResponse) => void
    puedeAvance: (tarea: TareaResponse) => boolean
    onEditar?: (tarea: TareaResponse) => void
    onCancelar?: (tarea: TareaResponse) => void
    puedeCancelar: (tarea: TareaResponse) => boolean
    // Elemento vencido: no se editan las tareas hasta que haya prorroga
    edicionBloqueada?: boolean
}

const apilado = { ...columna(spacing.xs), alignItems: 'center' }

// Cada dato va en su propia columna (titulo, dependencia, inicio y fin); los textos largos se cortan con puntos
// suspensivos para que la tabla quepa a 1280 px. Las tareas con un problema del plan (por ejemplo, termina despues del
// compromiso) llevan la marca "Revisar" bajo el titulo
const columnas = (conProblema: Set<number>): TableColumn<TareaResponse>[] => [
    {
        id: 'titulo',
        header: 'Título',
        render: (tarea) => (
            <div style={{ ...columna(spacing.xs), alignItems: 'flex-start', minWidth: 110 }}>
                <TextoCorto texto={tarea.titulo} ancho={220} />
                {conProblema.has(tarea.id) && <Badge status="warning" label="Revisar" />}
            </div>
        ),
    },
    {
        id: 'dependencia',
        header: 'Depende de',
        render: (tarea) => <TextoCorto texto={tarea.dependeDeTitulo} ancho={200} />,
    },
    {
        id: 'responsable',
        header: 'Responsable',
        render: (tarea) => <TextoCorto texto={tarea.responsableNombre} ancho={180} />,
    },
    {
        id: 'inicio',
        header: 'Inicio',
        align: 'center',
        render: (tarea) => <TextoSinCorte>{formatearFecha(tarea.fechaInicio)}</TextoSinCorte>,
    },
    {
        id: 'fin',
        header: 'Fin',
        align: 'center',
        render: (tarea) => (
            <div style={apilado}>
                <TextoSinCorte>{formatearFecha(tarea.fechaFin)}</TextoSinCorte>
                {tarea.vencida && <Badge status="error" label="Vencida" />}
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
            <div style={apilado}>
                <Badge status={ESTADO_TAREA[tarea.estado].estado} label={ESTADO_TAREA[tarea.estado].texto} />
                {tarea.estado === 'CANCELADA' && tarea.motivoEstado && (
                    <small style={textoSecundario}>{tarea.motivoEstado}</small>
                )}
            </div>
        ),
    },
]

const accion = (
    id: string,
    header: string,
    iconName: 'edit' | 'minus_circle' | 'chart_mixed_up_circle',
    onClick: ((tarea: TareaResponse) => void) | undefined,
    habilitada: (tarea: TareaResponse) => boolean,
): TableRowAction<TareaResponse>[] =>
    onClick ? [{ id, header, iconName, variant: 'ghost', disabled: (tarea) => !habilitada(tarea), onClick }] : []

// Las finalizadas y canceladas no se editan ni admiten avances: sus acciones quedan deshabilitadas
export const TablaTareas = ({
    plan,
    onVer,
    onAvance,
    puedeAvance,
    onEditar,
    onCancelar,
    puedeCancelar,
    edicionBloqueada = false,
}: TablaTareasProps) => {
    const conProblema = new Set(plan.problemas.flatMap((problema) => (problema.tareaId ? [problema.tareaId] : [])))

    return (
        <Table
            columns={columnas(conProblema)}
            rows={plan.tareas}
            getRowKey={(tarea) => String(tarea.id)}
            getRowLabel={(tarea) => tarea.titulo}
            rowActions={[
                { id: 'ver', header: 'Ver', iconName: 'eye', variant: 'ghost', onClick: onVer },
                ...accion('avance', 'Avance', 'chart_mixed_up_circle', onAvance, puedeAvance),
                ...accion('editar', 'Editar', 'edit', onEditar, (tarea) => tarea.editable && !edicionBloqueada),
                ...accion('cancelar', 'Cancelar', 'minus_circle', onCancelar, puedeCancelar),
            ]}
            emptyText="El plan todavía no tiene tareas"
        />
    )
}
