import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import type { Opcion } from '../../../utils/opciones'
import { bitacoraApi, usuariosComboApi } from '../api'
import { textoEntidad } from '../textos'

export interface CombosBitacora {
    entidades: Opcion[]
    usuarios: Opcion[]
}

const VACIOS: CombosBitacora = { entidades: [], usuarios: [] }

const porTexto = (a: Opcion, b: Opcion) => a.texto.localeCompare(b.texto, 'es')

// Cada combo se pide por su cuenta: si uno falla queda vacio, se avisa y el otro sigue sirviendo. Los usuarios solo se
// piden con USUARIO:LEER (el Auditor no lo tiene y no ve ese filtro)
export const useCombos = (pedirUsuarios: boolean) => {
    const [combos, setCombos] = useState<CombosBitacora>(VACIOS)

    useEffect(() => {
        let vigente = true
        const alFallar = (error: unknown) => {
            if (vigente) {
                avisarSiNoSeAviso(aErrorApi(error))
            }
        }

        bitacoraApi
            .entidades()
            .then((entidades) => {
                if (vigente) {
                    const opciones = entidades.map((valor) => ({ valor, texto: textoEntidad(valor) })).sort(porTexto)
                    setCombos((anterior) => ({ ...anterior, entidades: opciones }))
                }
            })
            .catch(alFallar)

        if (pedirUsuarios) {
            usuariosComboApi
                .listar()
                .then((usuarios) => {
                    if (vigente) {
                        const opciones = usuarios.map(({ id, nombre }) => ({ valor: String(id), texto: nombre }))
                        setCombos((anterior) => ({ ...anterior, usuarios: opciones.sort(porTexto) }))
                    }
                })
                .catch(alFallar)
        }
        return () => {
            vigente = false
        }
    }, [pedirUsuarios])

    return combos
}
