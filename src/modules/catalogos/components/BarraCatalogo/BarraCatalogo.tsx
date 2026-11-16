import { spacing } from '@hnba/design-tokens'
import { Select } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { conGenero } from '../../textos'
import type { FiltroEstado, TextosCatalogo } from '../../types'

interface BarraCatalogoProps {
    textos: TextosCatalogo
    busqueda: string
    onBuscar: (busqueda: string) => void
    placeholderBusqueda: string
    filtro: FiltroEstado
    onFiltrar: (filtro: FiltroEstado) => void
    filtrosExtra?: ReactNode
    // Boton principal de la pantalla (BotonNuevo); queda a la derecha, pegado a la tabla
    accion?: ReactNode
}

// Buscador y filtros de la pantalla, y a la derecha su boton principal (BotonNuevo)
export const BarraCatalogo = ({
    textos,
    busqueda,
    onBuscar,
    placeholderBusqueda,
    filtro,
    onFiltrar,
    filtrosExtra,
    accion,
}: BarraCatalogoProps) => {
    const filtros: Opcion[] = [
        { valor: 'activos', texto: `${conGenero(textos, 'Activ')}s` },
        { valor: 'inactivos', texto: `${conGenero(textos, 'Inactiv')}s` },
        { valor: 'todos', texto: `${conGenero(textos, 'Tod')}s` },
    ]

    return (
        <div style={filaEntreExtremos}>
            <div style={fila(spacing.md)}>
                <Buscador
                    valor={busqueda}
                    onCambiar={onBuscar}
                    etiqueta="Buscar"
                    placeholder={placeholderBusqueda}
                    ancho={288}
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
                {filtrosExtra}
            </div>
            {accion}
        </div>
    )
}
