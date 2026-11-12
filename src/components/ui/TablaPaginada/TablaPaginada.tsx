import type { Key } from 'react'
import { usePaginacion } from '../../../hooks/usePaginacion'
import { Paginacion } from '../Paginacion/Paginacion'
import { Tabla, type ColumnaTabla } from '../Tabla/Tabla'

interface TablaPaginadaProps<T> {
    columnas: ColumnaTabla<T>[]
    filas: T[]
    claveFila: (fila: T) => Key
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
        <div className="space-y-4">
            <Tabla
                columnas={columnas}
                filas={paginacion.filasPagina}
                claveFila={claveFila}
                cargando={cargando}
                textoVacio={textoVacio}
            />
            {!cargando && (
                <Paginacion
                    pagina={paginacion.pagina}
                    totalPaginas={paginacion.totalPaginas}
                    total={paginacion.total}
                    tamano={paginacion.tamano}
                    onCambiarPagina={paginacion.irAPagina}
                    onCambiarTamano={paginacion.cambiarTamano}
                />
            )}
        </div>
    )
}
