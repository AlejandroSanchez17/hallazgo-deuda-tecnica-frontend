import { spacing } from '@hnba/design-tokens'
import { Select } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import type { FiltroEstado } from '../../types'

const filtros: Opcion[] = [
    { valor: 'activos', texto: 'Activos' },
    { valor: 'inactivos', texto: 'Inactivos' },
    { valor: 'todos', texto: 'Todos' },
]

interface BarraUsuariosProps {
    busqueda: string
    onBuscar: (busqueda: string) => void
    filtro: FiltroEstado
    onFiltrar: (filtro: FiltroEstado) => void
    // Boton principal de la pantalla (Nuevo usuario); queda a la derecha, pegado a la tabla
    accion?: ReactNode
}

// Buscador y filtro de estado, y a la derecha el boton principal
export const BarraUsuarios = ({ busqueda, onBuscar, filtro, onFiltrar, accion }: BarraUsuariosProps) => (
    <div style={filaEntreExtremos}>
        <div style={fila(spacing.md)}>
            <Buscador
                valor={busqueda}
                onCambiar={onBuscar}
                etiqueta="Buscar"
                placeholder="Buscar por nombre, correo, usuario o rol…"
                ancho={320}
            />
            <div style={{ width: 160 }}>
                <Select
                    options={filtros}
                    value={opcionDe(filtros, filtro)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    onChange={(opcion) => onFiltrar(opcion.valor as FiltroEstado)}
                />
            </div>
        </div>
        {accion}
    </div>
)
