import type { Key, ReactNode } from 'react'
import { Cargando } from '../Cargando/Cargando'

type Alineacion = 'izquierda' | 'centro' | 'derecha'

export interface ColumnaTabla<T> {
    clave: string
    titulo: string
    render?: (fila: T) => ReactNode
    alineacion?: Alineacion
}

interface TablaProps<T> {
    columnas: ColumnaTabla<T>[]
    filas: T[]
    claveFila: (fila: T) => Key
    cargando?: boolean
    textoVacio?: string
}

const clasesAlineacion: Record<Alineacion, string> = {
    izquierda: 'text-left',
    centro: 'text-center',
    derecha: 'text-right',
}

const valorCelda = <T,>(fila: T, columna: ColumnaTabla<T>): ReactNode => {
    if (columna.render) {
        return columna.render(fila)
    }
    const valor = (fila as Record<string, unknown>)[columna.clave]
    return valor === null || valor === undefined ? '' : String(valor)
}

export const Tabla = <T,>({
    columnas,
    filas,
    claveFila,
    cargando = false,
    textoVacio = 'No hay registros',
}: TablaProps<T>) => (
    <div className="overflow-x-auto rounded-md border border-borde bg-blanco">
        <table className="w-full text-sm" aria-busy={cargando}>
            <thead className="bg-fondo text-texto-secundario">
                <tr>
                    {columnas.map((columna) => (
                        <th
                            key={columna.clave}
                            scope="col"
                            className={`border-b border-borde px-4 py-3 font-semibold ${clasesAlineacion[columna.alineacion ?? 'izquierda']}`}
                        >
                            {columna.titulo}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="[&_tr:last-child_td]:border-b-0">
                {cargando && (
                    <tr>
                        <td colSpan={columnas.length} className="px-4 py-6">
                            <Cargando />
                        </td>
                    </tr>
                )}
                {!cargando && filas.length === 0 && (
                    <tr>
                        <td colSpan={columnas.length} className="px-4 py-6 text-center text-texto-secundario">
                            {textoVacio}
                        </td>
                    </tr>
                )}
                {!cargando &&
                    filas.map((fila) => (
                        <tr key={claveFila(fila)} className="hover:bg-fondo">
                            {columnas.map((columna) => (
                                <td
                                    key={columna.clave}
                                    className={`border-b border-borde-suave px-4 py-3 ${clasesAlineacion[columna.alineacion ?? 'izquierda']}`}
                                >
                                    {valorCelda(fila, columna)}
                                </td>
                            ))}
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
)
