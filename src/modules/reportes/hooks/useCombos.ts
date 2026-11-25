import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { textoArea } from '../../../utils/areas'
import type { Opcion } from '../../../utils/opciones'
import { combosApi } from '../api'
import type { AreaCombo, ElementoCombo, EquipoCombo, RegistroCombo } from '../types'

export interface CombosReporte {
    criticidades: Opcion[]
    origenes: Opcion[]
    areas: Opcion[]
    aplicaciones: Opcion[]
    equipos: Opcion[]
    lideres: Opcion[]
    elementos: Opcion[]
}

const VACIOS: CombosReporte = {
    criticidades: [],
    origenes: [],
    areas: [],
    aplicaciones: [],
    equipos: [],
    lideres: [],
    elementos: [],
}

const porNombre = (a: Opcion, b: Opcion) => a.texto.localeCompare(b.texto, 'es')

const deRegistros = (registros: RegistroCombo[]): Opcion[] =>
    registros.map(({ id, nombre }) => ({ valor: String(id), texto: nombre })).sort(porNombre)

// Gerencias, areas y subareas ("Area › Subarea")
const deAreas = (areas: AreaCombo[]): Opcion[] =>
    areas.map((area) => ({ valor: String(area.id), texto: textoArea(area) })).sort(porNombre)

// Los lideres salen de los equipos: Lider y Miembro no tienen USUARIO:LEER, y con alcance PROPIO /equipos ya trae solo
// los suyos. Un lider se repite si dirige varios equipos
const lideresDe = (equipos: EquipoCombo[]): Opcion[] => {
    const porId = new Map<number, Opcion>()
    equipos.forEach(({ liderId, liderNombre }) => {
        if (liderId !== null && liderNombre !== null) {
            porId.set(liderId, { valor: String(liderId), texto: liderNombre })
        }
    })
    return [...porId.values()].sort(porNombre)
}

const deElementos = (elementos: ElementoCombo[]): Opcion[] =>
    elementos.map(({ id, codigo, titulo }) => ({ valor: String(id), texto: `${codigo} · ${titulo}` }))

// Cada combo se pide por su cuenta: si uno falla (por ejemplo, sin permiso de catalogos) queda vacio, se avisa y los
// demas siguen sirviendo. Los elementos solo se piden cuando el reporte los necesita (REP-05)
export const useCombos = (pedirElementos: boolean) => {
    const [combos, setCombos] = useState<CombosReporte>(VACIOS)

    useEffect(() => {
        let vigente = true
        const poner = (parcial: Partial<CombosReporte>) => {
            if (vigente) {
                setCombos((anterior) => ({ ...anterior, ...parcial }))
            }
        }
        const pedir = <T>(pedido: Promise<T>, alLlegar: (datos: T) => Partial<CombosReporte>) =>
            pedido
                .then((datos) => poner(alLlegar(datos)))
                .catch((error: unknown) => {
                    if (vigente) {
                        avisarSiNoSeAviso(aErrorApi(error))
                    }
                })

        void pedir(combosApi.criticidades(), (datos) => ({ criticidades: deRegistros(datos) }))
        void pedir(combosApi.origenes(), (datos) => ({ origenes: deRegistros(datos) }))
        void pedir(combosApi.areas(), (datos) => ({ areas: deAreas(datos) }))
        void pedir(combosApi.aplicaciones(), (datos) => ({ aplicaciones: deRegistros(datos) }))
        void pedir(combosApi.equipos(), (datos) => ({ equipos: deRegistros(datos), lideres: lideresDe(datos) }))
        return () => {
            vigente = false
        }
    }, [])

    useEffect(() => {
        if (!pedirElementos) {
            return
        }
        let vigente = true
        combosApi
            .elementos()
            .then((datos) => {
                if (vigente) {
                    setCombos((anterior) => ({ ...anterior, elementos: deElementos(datos) }))
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
    }, [pedirElementos])

    return combos
}
