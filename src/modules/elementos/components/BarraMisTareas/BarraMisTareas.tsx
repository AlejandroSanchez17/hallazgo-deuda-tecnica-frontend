import { spacing } from '@hnba/design-tokens'
import { Button, Select } from '@hnba/react-ui'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { fila } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { hayFiltrosTareas, OPCIONES_ESTADO_ABIERTA, OPCIONES_PLAZO, SIN_FILTROS_TAREAS } from '../../filtrosMisTareas'
import type { FiltrosMisTareas } from '../../typesPlan'

interface BarraMisTareasProps {
    busqueda: string
    onBuscar: (busqueda: string) => void
    filtros: FiltrosMisTareas
    onFiltrar: (filtros: FiltrosMisTareas) => void
}

// Una fila: el buscador, los dos filtros y "Limpiar filtros" (la pantalla no tiene boton principal)
export const BarraMisTareas = ({ busqueda, onBuscar, filtros, onFiltrar }: BarraMisTareasProps) => {
    const dibujar = (campo: keyof FiltrosMisTareas, todos: string, opciones: Opcion[]) => {
        const conTodos = [{ valor: '', texto: todos }, ...opciones]
        return (
            <div style={{ width: 170 }}>
                <Select
                    options={conTodos}
                    value={opcionDe(conTodos, filtros[campo])}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    aria-label={todos}
                    onChange={(opcion) => onFiltrar({ ...filtros, [campo]: opcion.valor })}
                />
            </div>
        )
    }

    return (
        <div style={fila(spacing.sm)}>
            <Buscador
                valor={busqueda}
                onCambiar={onBuscar}
                etiqueta="Buscar"
                placeholder="Buscar por tarea o elemento…"
                ancho={360}
            />
            {dibujar('estado', 'Todo estado', OPCIONES_ESTADO_ABIERTA)}
            {dibujar('plazo', 'Todo plazo', OPCIONES_PLAZO)}
            {hayFiltrosTareas(filtros) && (
                <Button variant="ghost" iconName="x_clear" onClick={() => onFiltrar(SIN_FILTROS_TAREAS)}>
                    Limpiar filtros
                </Button>
            )}
        </div>
    )
}
