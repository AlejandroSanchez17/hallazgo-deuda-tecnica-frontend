import { Table, type TableColumn } from '@hnba/react-ui'
import { formatearDias } from '../../textos'
import type { CierrePorCriticidad } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface TiempoCierreProps {
    filas: CierrePorCriticidad[]
}

const columnas: TableColumn<CierrePorCriticidad>[] = [
    { id: 'criticidad', header: 'Criticidad', accessor: (fila) => fila.criticidad },
    { id: 'cerrados', header: 'Cerrados', align: 'center', accessor: (fila) => fila.cerrados },
    { id: 'promedio', header: 'Promedio', align: 'center', accessor: (fila) => formatearDias(fila.promedioDias) },
]

export const TiempoCierre = ({ filas }: TiempoCierreProps) => (
    <Bloque
        titulo="Tiempo promedio de cierre por criticidad"
        nota="Días entre la identificación y el cierre de los elementos cerrados en el período."
    >
        <Table
            columns={columnas}
            rows={[...filas].sort((a, b) => a.nivel - b.nivel)}
            getRowKey={(fila) => String(fila.criticidadId)}
            emptyText="No hay criticidades activas"
        />
    </Bloque>
)
