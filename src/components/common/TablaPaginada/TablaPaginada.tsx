import { spacing } from '@hnba/design-tokens'
import { Pagination, Table, type TableColumn } from '@hnba/react-ui'
import { usePaginacion, TAMANOS_PAGINA } from '../../../hooks/usePaginacion'
import { columna } from '../../../styles/disposicion'

interface TablaPaginadaProps<T> {
    columnas: TableColumn<T>[]
    filas: T[]
    claveFila: (fila: T) => string | number
    claveReinicio: string
    cargando?: boolean
    textoVacio?: string
}

// claveReinicio cambia con la busqueda o los filtros para volver a la primera pagina
export const TablaPaginada = <T,>({
    columnas,
    filas,
    claveFila,
    claveReinicio,
    cargando = false,
    textoVacio,
}: TablaPaginadaProps<T>) => {
    const paginacion = usePaginacion(filas, claveReinicio)

    return (
        <div style={columna(spacing.md)}>
            <Table
                columns={columnas}
                rows={paginacion.filasPagina}
                getRowKey={(fila) => String(claveFila(fila))}
                loading={cargando}
                emptyText={textoVacio}
            />
            {!cargando && paginacion.total > 0 && (
                // pageSizePosition es la posicion del selector de filas: a la izquierda, los numeros quedan a la derecha
                <Pagination
                    page={paginacion.pagina}
                    totalRecords={paginacion.total}
                    pageSize={paginacion.tamano}
                    pageSizeOptions={TAMANOS_PAGINA}
                    showPageSizeSelector
                    pageSizePosition="left"
                    onPageChange={paginacion.irAPagina}
                    onPageSizeChange={paginacion.cambiarTamano}
                />
            )}
        </div>
    )
}
