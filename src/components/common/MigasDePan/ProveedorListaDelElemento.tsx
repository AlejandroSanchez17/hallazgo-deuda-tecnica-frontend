import { useState, type ReactNode } from 'react'
import { ContextoLista } from './listaDelElemento'

// Guarda la ruta de la lista del elemento que se está viendo; ver listaDelElemento.ts
export const ProveedorListaDelElemento = ({ children }: { children: ReactNode }) => {
    const [lista, establecer] = useState<string | null>(null)
    return <ContextoLista.Provider value={{ lista, establecer }}>{children}</ContextoLista.Provider>
}
