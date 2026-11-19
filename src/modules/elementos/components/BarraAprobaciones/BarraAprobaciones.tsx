import { spacing } from '@hnba/design-tokens'
import { Button, Select } from '@hnba/react-ui'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { fila } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { hayFiltrosAprobaciones, OPCIONES_TIPO_PENDIENTE, SIN_FILTROS_APROBACIONES } from '../../filtrosAprobaciones'
import type { FiltrosAprobaciones } from '../../typesProrroga'

interface BarraAprobacionesProps {
    busqueda: string
    onBuscar: (busqueda: string) => void
    filtros: FiltrosAprobaciones
    onFiltrar: (filtros: FiltrosAprobaciones) => void
    criticidades: Opcion[]
    equipos: Opcion[]
}

// Una fila: el buscador, los tres filtros y "Limpiar filtros" (la pantalla no tiene boton principal)
export const BarraAprobaciones = ({
    busqueda,
    onBuscar,
    filtros,
    onFiltrar,
    criticidades,
    equipos,
}: BarraAprobacionesProps) => {
    const dibujar = (campo: keyof FiltrosAprobaciones, todos: string, opciones: Opcion[]) => {
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
                placeholder="Buscar por elemento, equipo o quien pidió…"
                ancho={360}
            />
            {dibujar('tipo', 'Todo tipo', OPCIONES_TIPO_PENDIENTE)}
            {dibujar('criticidad', 'Toda criticidad', criticidades)}
            {dibujar('equipo', 'Todo equipo', equipos)}
            {hayFiltrosAprobaciones(filtros) && (
                <Button variant="ghost" iconName="x_clear" onClick={() => onFiltrar(SIN_FILTROS_APROBACIONES)}>
                    Limpiar filtros
                </Button>
            )}
        </div>
    )
}
