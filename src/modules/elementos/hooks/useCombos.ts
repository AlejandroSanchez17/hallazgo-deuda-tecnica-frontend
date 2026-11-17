import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { combosApi } from '../api'
import type {
    CategoriaDisponible,
    CriticidadDisponible,
    EquipoDisponible,
    HorasPorTalla,
    RegistroDeCatalogo,
} from '../types'

export interface Combos {
    origenes: RegistroDeCatalogo[]
    criticidades: CriticidadDisponible[]
    categorias: CategoriaDisponible[]
    aplicaciones: RegistroDeCatalogo[]
    equipos: EquipoDisponible[]
}

const VACIOS: Combos = { origenes: [], criticidades: [], categorias: [], aplicaciones: [], equipos: [] }

// Se piden al abrir el formulario. Al editar no hacen falta criticidades ni equipos: no se cambian
export const useCombos = (esNuevo: boolean) => {
    const [combos, setCombos] = useState<Combos>(VACIOS)

    useEffect(() => {
        let vigente = true
        Promise.all([
            combosApi.origenes(),
            esNuevo ? combosApi.criticidades() : Promise.resolve([]),
            combosApi.categorias(),
            combosApi.aplicaciones(),
            esNuevo ? combosApi.equipos() : Promise.resolve([]),
        ])
            .then(([origenes, criticidades, categorias, aplicaciones, equipos]) => {
                if (vigente) {
                    setCombos({ origenes, criticidades, categorias, aplicaciones, equipos })
                }
            })
            .catch((error: unknown) => {
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(error))
                }
            })
        return () => {
            vigente = false
        }
    }, [esNuevo])

    return combos
}

// Aparte de los combos: si los parametros no se pueden leer, el combo de talla sigue sirviendo sin las horas
export const useHorasPorTalla = () => {
    const [horasPorTalla, setHorasPorTalla] = useState<HorasPorTalla>({})

    useEffect(() => {
        let vigente = true
        combosApi
            .horasPorTalla()
            .then((horas) => {
                if (vigente) {
                    setHorasPorTalla(horas)
                }
            })
            .catch(() => undefined)
        return () => {
            vigente = false
        }
    }, [])

    return horasPorTalla
}
