import { Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { useNavigate } from 'react-router-dom'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { enlaceListado } from '../../filtros'
import { contar } from '../../textos'
import type { EquipoRanking } from '../../types'
import { Bloque } from '../Bloque/Bloque'
import { CeldaBarra } from '../CeldaBarra/CeldaBarra'

interface RankingEquiposProps {
    equipos: EquipoRanking[]
}

export const RankingEquipos = ({ equipos }: RankingEquiposProps) => {
    const navegar = useNavigate()
    const maximo = Math.max(0, ...equipos.map((equipo) => equipo.vencidos))

    const columnas: TableColumn<EquipoRanking>[] = [
        {
            id: 'equipo',
            header: 'Equipo',
            // Los abiertos van debajo del nombre: con una columna propia la tabla no cabe de a dos a 1280 px
            render: (equipo) => (
                <div style={columna(2)}>
                    <span>{equipo.equipo}</span>
                    <small style={textoSecundario}>{contar(equipo.abiertos, 'abierto', 'abiertos')}</small>
                </div>
            ),
        },
        {
            id: 'vencidos',
            header: 'Vencidos',
            render: (equipo) => (
                <CeldaBarra
                    valor={equipo.vencidos}
                    maximo={maximo}
                    texto={String(equipo.vencidos)}
                    etiqueta={`${equipo.equipo}: ${equipo.vencidos} vencidos`}
                />
            ),
        },
    ]

    // Lleva al listado con los vencidos de ese equipo
    const acciones: TableRowAction<EquipoRanking>[] = [
        {
            id: 'ver',
            header: 'Ver',
            iconName: 'eye',
            variant: 'ghost',
            onClick: (equipo) => void navegar(enlaceListado('VENCIDO', equipo.equipoId)),
        },
    ]

    return (
        <Bloque titulo="Equipos con más vencidos" nota="Hasta 10 equipos con al menos un elemento vencido, hoy.">
            <Table
                columns={columnas}
                rows={equipos}
                rowActions={acciones}
                getRowLabel={(equipo) => `Vencidos de ${equipo.equipo}`}
                getRowKey={(equipo) => String(equipo.equipoId)}
                emptyText="Ningún equipo tiene elementos vencidos"
            />
        </Bloque>
    )
}
