import { spacing } from '@hnba/design-tokens'
import { Button, Select } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { hayFiltros, SIN_FILTROS } from '../../filtros'
import { OPCIONES_ESTADO, OPCIONES_SEMAFORO, OPCIONES_TIPO } from '../../textos'
import type { FiltrosElementos } from '../../types'

interface FiltroConfig {
    campo: keyof FiltrosElementos
    // Texto de la opcion "todos", que hace de etiqueta del filtro
    todos: string
    opciones: Opcion[]
    ancho: number
}

interface BarraElementosProps {
    busqueda: string
    onBuscar: (busqueda: string) => void
    filtros: FiltrosElementos
    onFiltrar: (filtros: FiltrosElementos) => void
    // Opciones que salen de las filas cargadas
    criticidades: Opcion[]
    equipos: Opcion[]
    origenes: Opcion[]
    // Boton principal (Nuevo); queda a la derecha, pegado a la tabla
    accion?: ReactNode
    // En la lista de un solo tipo el filtro de tipo sobra
    ocultarTipo?: boolean
}

// Dos filas: el buscador arriba con el boton a la derecha, y los seis filtros abajo
export const BarraElementos = ({
    busqueda,
    onBuscar,
    filtros,
    onFiltrar,
    criticidades,
    equipos,
    origenes,
    accion,
    ocultarTipo = false,
}: BarraElementosProps) => {
    const dibujar = ({ campo, todos, opciones, ancho }: FiltroConfig) => {
        const conTodos = [{ valor: '', texto: todos }, ...opciones]
        return (
            <div key={campo} style={{ width: ancho }}>
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
        <div style={columna(spacing.sm)}>
            <div style={filaEntreExtremos}>
                <Buscador
                    valor={busqueda}
                    onCambiar={onBuscar}
                    etiqueta="Buscar"
                    placeholder="Buscar por código, título, equipo o criticidad…"
                    ancho={420}
                />
                {accion}
            </div>
            <div style={fila(spacing.sm)}>
                {!ocultarTipo && dibujar({ campo: 'tipo', todos: 'Todo tipo', opciones: OPCIONES_TIPO, ancho: 150 })}
                {dibujar({ campo: 'estado', todos: 'Todo estado', opciones: OPCIONES_ESTADO, ancho: 180 })}
                {dibujar({ campo: 'semaforo', todos: 'Todo semáforo', opciones: OPCIONES_SEMAFORO, ancho: 170 })}
                {dibujar({ campo: 'criticidad', todos: 'Toda criticidad', opciones: criticidades, ancho: 170 })}
                {dibujar({ campo: 'equipo', todos: 'Todo equipo', opciones: equipos, ancho: 180 })}
                {dibujar({ campo: 'origen', todos: 'Todo origen', opciones: origenes, ancho: 170 })}
                {hayFiltros(filtros) && (
                    <Button variant="ghost" iconName="x_clear" onClick={() => onFiltrar(SIN_FILTROS)}>
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </div>
    )
}
