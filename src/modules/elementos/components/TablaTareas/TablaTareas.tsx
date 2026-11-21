import { spacing } from '@hnba/design-tokens'
import { Badge, Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { ESTADO_TAREA, textoNumero } from '../../textosPlan'
import type { PlanResponse, TareaResponse } from '../../typesPlan'
import { BarraAvance } from '../BarraAvance/BarraAvance'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

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
}

const sinCorte = { whiteSpace: 'nowrap' } as const

const apilado = { ...columna(spacing.xs), alignItems: 'center' }

// Las tareas con un problema del plan (por ejemplo, termina despues del compromiso) llevan la marca "Revisar".
// La dependencia va bajo el titulo, para que la tabla quepa a 1280 px
const columnas = (conProblema: Set<number>): TableColumn<TareaResponse>[] => [
    {
        id: 'titulo',
        header: 'Título',
        render: (tarea) => (
            <div style={{ ...columna(spacing.xs), alignItems: 'flex-start', minWidth: 110 }}>
                <TextoCorto texto={tarea.titulo} ancho={260} />
                {tarea.dependeDeTitulo && (
                    <small style={textoSecundario}>
                        <TextoCorto texto={`Depende de: ${tarea.dependeDeTitulo}`} ancho={260} />
                    </small>
                )}
                {conProblema.has(tarea.id) && <Badge status="warning" label="Revisar" />}
            </div>
        ),
    },
    {
        id: 'responsable',
        header: 'Responsable',
        render: (tarea) => <TextoCorto texto={tarea.responsableNombre} ancho={180} />,
    },
    // Inicio y fin en una columna para que la tabla quepa a 1280 px
    {
        id: 'fechas',
        header: 'Fechas',
        align: 'center',
        render: (tarea) => (
            <div style={apilado}>
                <span style={sinCorte}>{formatearFecha(tarea.fechaInicio)}</span>
                <span style={sinCorte}>al {formatearFecha(tarea.fechaFin)}</span>
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
                ...accion('editar', 'Editar', 'edit', onEditar, (tarea) => tarea.editable),
                ...accion('cancelar', 'Cancelar', 'minus_circle', onCancelar, puedeCancelar),
            ]}
            emptyText="El plan todavía no tiene tareas"
        />
    )
}
