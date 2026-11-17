import { useState } from 'react'
import { elementosApi } from '../api'
import type { ElementoDetalleResponse } from '../types'
import { useGuardar } from './useGuardar'

// El motivo se pide en el formulario y, antes de enviar, se confirma: la anulacion no se deshace
export const useAnular = (ficha: ElementoDetalleResponse, onAnulado: () => void) => {
    const [motivo, setMotivo] = useState('')
    const [faltaMotivo, setFaltaMotivo] = useState(false)
    const [confirmando, setConfirmando] = useState(false)
    const { guardar, errores, guardando } = useGuardar(onAnulado)

    const pedirConfirmacion = () => {
        if (motivo.trim() === '') {
            setFaltaMotivo(true)
            return
        }
        setConfirmando(true)
    }

    const confirmar = async () => {
        await guardar(() => elementosApi.anular(ficha.id, motivo.trim()))
        setConfirmando(false)
    }

    return {
        motivo,
        cambiarMotivo: (valor: string) => {
            setMotivo(valor)
            setFaltaMotivo(false)
        },
        errorMotivo: faltaMotivo ? 'Es obligatorio' : errores.motivo,
        guardando,
        confirmando,
        pedirConfirmacion,
        confirmar: () => void confirmar(),
        cancelarConfirmacion: () => setConfirmando(false),
    }
}
