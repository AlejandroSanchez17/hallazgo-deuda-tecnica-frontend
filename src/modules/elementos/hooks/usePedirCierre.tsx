import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { cierresApi } from '../apiProrrogas'
import type { ElementoResponse } from '../types'

const quienValida = (elemento: ElementoResponse) =>
    elemento.tipo === 'HALLAZGO'
        ? 'Lo valida el rol que se definió en Parámetros para el cierre de hallazgos.'
        : 'Lo valida el rol que pide su criticidad.'

// Pedir el cierre no lleva datos, solo confirmacion. Si al backend le falta algo (RN-09) responde 422 con un
// error por problema: se guardan todos para mostrarlos juntos hasta el siguiente intento. La pantalla dibuja `dialogo`
export const usePedirCierre = (elemento: ElementoResponse | null, onHecho: () => void) => {
    const [abierto, setAbierto] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [problemas, setProblemas] = useState<string[]>([])

    const confirmar = async () => {
        if (!elemento) {
            return
        }
        setEnviando(true)
        setProblemas([])
        try {
            void avisarExito(await cierresApi.pedir(elemento.id))
            onHecho()
        } catch (error) {
            const errorApi = aErrorApi(error)
            if (errorApi.estado === 422 && errorApi.errores.length > 0) {
                setProblemas(errorApi.errores.map((problema) => problema.mensaje))
            } else {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setEnviando(false)
            setAbierto(false)
        }
    }

    const dialogo = (
        <ConfirmDialog
            open={abierto}
            kind="alert"
            variant="info"
            title={elemento ? `¿Pedir el cierre de ${elemento.codigo}?` : ''}
            description={
                elemento ? `${quienValida(elemento)} Mientras espera la validación no se pueden pedir prórrogas.` : ''
            }
            confirmLabel="Pedir cierre"
            cancelLabel="Cancelar"
            confirmLoading={enviando}
            onConfirm={() => void confirmar()}
            onClose={() => setAbierto(false)}
        />
    )

    return { pedir: () => setAbierto(true), problemas, dialogo }
}
