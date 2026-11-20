import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { aErroresCampo, type ErroresCampo } from '../../../utils/erroresCampo'
import { mensajeExito } from '../textos'
import type { TextosRegistro } from '../types'

interface OpcionesGuardar<F, S, R> {
    aSolicitud: (formulario: F) => S
    crear: (solicitud: S) => Promise<R>
    actualizar: (id: number, solicitud: S) => Promise<R>
    textos: TextosRegistro
    // Recibe lo que devolvio el backend: al crear, el registro nuevo
    onGuardado: (guardado: R) => void
}

export const useGuardar = <F, S, R>({
    aSolicitud,
    crear,
    actualizar,
    textos,
    onGuardado,
}: OpcionesGuardar<F, S, R>) => {
    const [errores, setErrores] = useState<ErroresCampo>({})
    const [guardando, setGuardando] = useState(false)

    const guardar = async (formulario: F, id?: number) => {
        setGuardando(true)
        setErrores({})
        try {
            const solicitud = aSolicitud(formulario)
            const guardado = id !== undefined ? await actualizar(id, solicitud) : await crear(solicitud)
            void avisarExito(mensajeExito(textos, id === undefined ? 'cread' : 'actualizad'))
            onGuardado(guardado)
        } catch (error) {
            const errorApi = aErrorApi(error)
            // 409 y 422 traen el campo en errores: se marca en el formulario y ademas se avisa
            setErrores(aErroresCampo(errorApi.errores))
            // Un 400 con campos ya se ve debajo de cada campo
            if (errorApi.estado !== 400 || errorApi.errores.length === 0) {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setGuardando(false)
        }
    }

    return { guardar, errores, guardando }
}
