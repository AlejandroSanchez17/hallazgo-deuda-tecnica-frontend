import { useState } from 'react'
import type { ErroresCampo } from '../../../utils/erroresCampo'
import { aFechaApi } from '../../../utils/formato'
import { prorrogasApi } from '../apiProrrogas'
import { hoyApi } from '../fechas'
import type { ProrrogasDelElemento } from '../typesProrroga'
import { useGuardar } from './useGuardar'

// Dia siguiente a una fecha 'AAAA-MM-DD'
const diaSiguiente = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-').map(Number)
    return aFechaApi(new Date(anio, mes - 1, dia + 1))
}

// La fecha propuesta tiene que ser posterior a la vigente y a hoy (manda el backend)
export const primeraFechaPosible = (resumen: ProrrogasDelElemento) => {
    const hoy = hoyApi()
    return diaSiguiente(resumen.fechaCompromisoVigente > hoy ? resumen.fechaCompromisoVigente : hoy)
}

export const useProrrogaForm = (elementoId: number, onGuardado: () => void) => {
    const [fechaPropuesta, setFechaPropuesta] = useState('')
    const [justificacion, setJustificacion] = useState('')
    const { guardar, errores, guardando } = useGuardar(onGuardado)

    // El backend marca la justificacion vacia; la fecha se marca aqui porque el DatePicker no deja enviarla vacia
    const enviar = () => {
        const locales: ErroresCampo = fechaPropuesta === '' ? { fechaPropuesta: 'Es obligatoria' } : {}
        void guardar(
            () => prorrogasApi.pedir(elementoId, { fechaPropuesta, justificacion: justificacion.trim() }),
            locales,
            justificacion.trim() === '' ? { justificacion: 'Es obligatoria' } : {},
        )
    }

    return { fechaPropuesta, setFechaPropuesta, justificacion, setJustificacion, errores, guardando, enviar }
}
