import { useCallback, useEffect, useState } from 'react'
import { aErrorApi, type ErrorApi } from '../../../services/api'
import { equiposApi } from '../api'
import type { EquipoDetalleResponse, MiembroResponse } from '../types'

interface Resultado {
    id: number
    detalle: EquipoDetalleResponse | null
    // Todos los miembros, tambien los retirados
    historialMiembros: MiembroResponse[]
    historialLideres: MiembroResponse[]
    error: ErrorApi | null
}

// Detalle del equipo con sus miembros vigentes y los dos historiales
export const useDetalleEquipo = (id: number) => {
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let vigente = true
        Promise.all([equiposApi.obtener(id), equiposApi.listarMiembros(id, true), equiposApi.listarLideres(id)])
            .then(([detalle, historialMiembros, historialLideres]) => {
                if (vigente) {
                    setResultado({ id, detalle, historialMiembros, historialLideres, error: null })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    setResultado({
                        id,
                        detalle: null,
                        historialMiembros: [],
                        historialLideres: [],
                        error: aErrorApi(error),
                    })
                }
            })
        return () => {
            vigente = false
        }
    }, [id, version])

    const recargar = useCallback(() => setVersion((anterior) => anterior + 1), [])

    // Al recargar se sigue mostrando el equipo actual; solo otro equipo muestra "Cargando"
    const delEquipoActual = resultado?.id === id ? resultado : null
    return {
        detalle: delEquipoActual?.detalle ?? null,
        historialMiembros: delEquipoActual?.historialMiembros ?? [],
        historialLideres: delEquipoActual?.historialLideres ?? [],
        cargando: delEquipoActual === null,
        error: delEquipoActual?.error ?? null,
        recargar,
    }
}
