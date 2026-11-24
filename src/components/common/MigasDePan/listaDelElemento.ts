import { createContext, useContext, useEffect } from 'react'

export interface ContextoListaDelElemento {
    lista: string | null
    // Estable entre renders: las pantallas lo usan dentro de un efecto
    establecer: (lista: string | null) => void
}

export const ContextoLista = createContext<ContextoListaDelElemento>({ lista: null, establecer: () => undefined })

// La miga "Hallazgos y deuda" de las pantallas de un elemento (detalle, plan, tarea) debe llevar a la lista de su tipo
// (Hallazgos o Deuda técnica), y el tipo solo se sabe cuando la pantalla ya cargó el elemento. Este contexto
// (ProveedorListaDelElemento, en el layout) comunica la ruta de esa lista desde la pantalla hasta las migas
export const useListaDelElemento = () => useContext(ContextoLista).lista

// Lo llama la pantalla de un elemento con la ruta de su lista (undefined mientras no se conoce)
export const usePublicarListaDelElemento = (ruta: string | undefined) => {
    const { establecer } = useContext(ContextoLista)
    useEffect(() => {
        establecer(ruta ?? null)
        return () => establecer(null)
    }, [ruta, establecer])
}
