import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { elementosApi } from '../api'
import type { Edicion, ElementoDetalleResponse, ElementoResponse } from '../types'

// La fila de la lista no trae la descripcion ni el bloque del tipo: se pide la ficha antes de abrir Editar
export const useFichaElemento = () => {
    const [edicion, setEdicion] = useState<Edicion<ElementoDetalleResponse>>(undefined)
    const [abriendo, setAbriendo] = useState(false)

    const abrirEdicion = (elemento: ElementoResponse) => {
        if (abriendo) {
            return
        }
        setAbriendo(true)
        elementosApi
            .obtener(elemento.id)
            .then(setEdicion)
            .catch((error: unknown) => avisarSiNoSeAviso(aErrorApi(error)))
            .finally(() => setAbriendo(false))
    }

    return {
        edicion,
        abrirNuevo: () => setEdicion(null),
        abrirEdicion,
        cerrar: () => setEdicion(undefined),
    }
}
