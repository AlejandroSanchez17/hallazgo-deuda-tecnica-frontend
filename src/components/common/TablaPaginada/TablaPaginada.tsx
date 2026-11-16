import { spacing } from '@hnba/design-tokens'
import { Pagination, Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { usePaginacion, TAMANOS_PAGINA } from '../../../hooks/usePaginacion'
import { columna } from '../../../styles/disposicion'

interface TablaPaginadaProps<T> {
    columnas: TableColumn<T>[]
    // Una columna por accion (rowActions de la libreria); sin acciones no se dibuja ninguna
    acciones?: TableRowAction<T>[]
    filas: T[]
    claveFila: (fila: T) => string | number
    // Nombre legible de la fila: los lectores de pantalla dicen "Editar — Ana Torres" y no solo "Editar"
    etiquetaFila?: (fila: T) => string
    claveReinicio: string
    cargando?: boolean
    textoVacio?: string
}

// claveReinicio cambia con la busqueda o los filtros para volver a la primera pagina
export const TablaPaginada = <T,>({
    columnas,
    acciones,
    filas,
    claveFila,
    etiquetaFila,
    claveReinicio,
    cargando = false,
    textoVacio,
}: TablaPaginadaProps<T>) => {
    const paginacion = usePaginacion(filas, claveReinicio)

    return (
        <div style={columna(spacing.md)}>
            <Table
                columns={columnas}
                rowActions={acciones}
                getRowLabel={etiquetaFila}
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
