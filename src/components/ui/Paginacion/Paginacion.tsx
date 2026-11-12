import { useId } from 'react'
import { TAMANOS_PAGINA } from '../../../hooks/usePaginacion'

interface PaginacionProps {
    pagina: number
    totalPaginas: number
    total: number
    tamano: number
    onCambiarPagina: (pagina: number) => void
    onCambiarTamano: (tamano: number) => void
}

type ElementoPaginacion = number | 'hueco'

// Con muchas paginas se muestran la primera, la ultima y las vecinas de la actual
const paginasVisibles = (pagina: number, totalPaginas: number): ElementoPaginacion[] => {
    if (totalPaginas <= 7) {
        return Array.from({ length: totalPaginas }, (_, indice) => indice + 1)
    }
    const numeros = [1, pagina - 1, pagina, pagina + 1, totalPaginas]
        .filter((numero, indice, lista) => numero >= 1 && numero <= totalPaginas && lista.indexOf(numero) === indice)
        .sort((a, b) => a - b)
    return numeros.flatMap((numero, indice): ElementoPaginacion[] =>
        indice > 0 && numero - numeros[indice - 1] > 1 ? ['hueco', numero] : [numero],
    )
}

const clasesBoton =
    'min-w-8 cursor-pointer rounded-md px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-texto-secundario disabled:cursor-not-allowed disabled:opacity-40'

export const Paginacion = ({
    pagina,
    totalPaginas,
    total,
    tamano,
    onCambiarPagina,
    onCambiarTamano,
}: PaginacionProps) => {
    const idTamano = useId()

    if (total === 0) {
        return null
    }

    const desde = (pagina - 1) * tamano + 1
    const hasta = Math.min(pagina * tamano, total)

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-texto-secundario">
            <div className="flex items-center gap-4">
                <span>
                    Mostrando {desde}–{hasta} de {total}
                </span>
                <span className="flex items-center gap-2">
                    <label htmlFor={idTamano}>Filas por página</label>
                    <select
                        id={idTamano}
                        value={tamano}
                        onChange={(evento) => onCambiarTamano(Number(evento.target.value))}
                        className="cursor-pointer rounded-md border border-borde bg-blanco px-2 py-1 text-texto"
                    >
                        {TAMANOS_PAGINA.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </span>
            </div>

            <nav aria-label="Paginación" className="flex items-center gap-1">
                <button
                    type="button"
                    className={`${clasesBoton} hover:bg-borde-suave`}
                    disabled={pagina === 1}
                    onClick={() => onCambiarPagina(pagina - 1)}
                >
                    Anterior
                </button>
                {paginasVisibles(pagina, totalPaginas).map((elemento, indice) =>
                    elemento === 'hueco' ? (
                        <span key={`hueco-${indice}`} className="px-1" aria-hidden="true">
                            …
                        </span>
                    ) : (
                        <button
                            key={elemento}
                            type="button"
                            aria-current={elemento === pagina ? 'page' : undefined}
                            className={`${clasesBoton} ${elemento === pagina ? 'bg-texto font-semibold text-blanco' : 'text-texto hover:bg-borde-suave'}`}
                            onClick={() => onCambiarPagina(elemento)}
                        >
                            {elemento}
                        </button>
                    ),
                )}
                <button
                    type="button"
                    className={`${clasesBoton} hover:bg-borde-suave`}
                    disabled={pagina === totalPaginas}
                    onClick={() => onCambiarPagina(pagina + 1)}
                >
                    Siguiente
                </button>
            </nav>
        </div>
    )
}
