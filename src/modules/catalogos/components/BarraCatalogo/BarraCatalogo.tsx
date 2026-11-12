import type { ReactNode } from 'react'
import { Boton } from '../../../../components/ui/Boton/Boton'
import { Buscador } from '../../../../components/ui/Buscador/Buscador'
import { Selector } from '../../../../components/ui/Selector/Selector'
import { conGenero } from '../../textos'
import type { FiltroEstado, TextosCatalogo } from '../../types'

interface BarraCatalogoProps {
    textos: TextosCatalogo
    busqueda: string
    onBuscar: (busqueda: string) => void
    placeholderBusqueda: string
    filtro: FiltroEstado
    onFiltrar: (filtro: FiltroEstado) => void
    onNuevo?: () => void
    filtrosExtra?: ReactNode
}

export const BarraCatalogo = ({
    textos,
    busqueda,
    onBuscar,
    placeholderBusqueda,
    filtro,
    onFiltrar,
    onNuevo,
    filtrosExtra,
}: BarraCatalogoProps) => {
    const filtros = [
        { valor: 'activos', texto: `${conGenero(textos, 'Activ')}s` },
        { valor: 'inactivos', texto: `${conGenero(textos, 'Inactiv')}s` },
        { valor: 'todos', texto: `${conGenero(textos, 'Tod')}s` },
    ]

    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-end gap-3">
                <div className="w-72">
                    <Buscador valor={busqueda} onCambiar={onBuscar} placeholder={placeholderBusqueda} />
                </div>
                <div className="w-40">
                    <Selector
                        etiqueta="Estado"
                        ocultarEtiqueta
                        opciones={filtros}
                        textoVacio={null}
                        value={filtro}
                        onChange={(evento) => onFiltrar(evento.target.value as FiltroEstado)}
                    />
                </div>
                {filtrosExtra}
            </div>
            {onNuevo && (
                <Boton variante="primario" onClick={onNuevo}>
                    {`${conGenero(textos, 'Nuev')} ${textos.sustantivo}`}
                </Boton>
            )}
        </div>
    )
}
