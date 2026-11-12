import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { aErroresCampo, type ErroresCampo } from '../../../utils/erroresCampo'
import { mensajeExito } from '../textos'
import type { TextosCatalogo } from '../types'

interface OpcionesGuardar<F, S> {
    aSolicitud: (formulario: F) => S
    crear?: (solicitud: S) => Promise<unknown>
    actualizar: (id: number, solicitud: S) => Promise<unknown>
    textos: TextosCatalogo
    onGuardado: () => void
}

export const useGuardarCatalogo = <F, S>({
    aSolicitud,
    crear,
    actualizar,
    textos,
    onGuardado,
}: OpcionesGuardar<F, S>) => {
    const [errores, setErrores] = useState<ErroresCampo>({})
    const [guardando, setGuardando] = useState(false)

    const guardar = async (formulario: F, id?: number) => {
        setGuardando(true)
        setErrores({})
        try {
            const solicitud = aSolicitud(formulario)
            if (id !== undefined) {
                await actualizar(id, solicitud)
            } else if (crear) {
                await crear(solicitud)
            }
            void avisarExito(mensajeExito(textos, id === undefined ? 'cread' : 'actualizad'))
            onGuardado()
        } catch (error) {
            const errorApi = aErrorApi(error)
            const erroresCampo = aErroresCampo(errorApi.errores)
            // El duplicado puede llegar sin campo, pero siempre es por el nombre
            if (errorApi.estado === 409 && errorApi.errores.length === 0) {
                erroresCampo.nombre = errorApi.mensaje
            }
            setErrores(erroresCampo)
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
