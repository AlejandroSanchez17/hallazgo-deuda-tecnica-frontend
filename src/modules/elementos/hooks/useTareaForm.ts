import { useEffect, useState } from 'react'
import { useFormulario } from '../../../hooks/useFormulario'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { formatearFecha } from '../../../utils/formato'
import type { Opcion } from '../../../utils/opciones'
import { combosApi } from '../api'
import { planesApi } from '../apiPlan'
import { aDecimal, textoNumero } from '../textosPlan'
import type { MiembroDelEquipo } from '../types'
import type { PlanResponse, TareaFormulario, TareaRequest, TareaResponse } from '../typesPlan'
import { useGuardar } from './useGuardar'

const SIN_DEPENDENCIA: Opcion = { valor: '', texto: 'Sin dependencia' }

const opcionMiembro = (miembro: MiembroDelEquipo): Opcion => ({
    valor: String(miembro.usuarioId),
    texto: miembro.esLider ? `${miembro.usuarioNombre} · líder del equipo` : miembro.usuarioNombre,
})

const aNumero = (valor: string) => (valor === '' ? null : Number(valor))

const aSolicitud = (formulario: TareaFormulario): TareaRequest => ({
    titulo: formulario.titulo.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    responsableId: aNumero(formulario.responsableId),
    fechaInicio: formulario.fechaInicio === '' ? null : formulario.fechaInicio,
    fechaFin: formulario.fechaFin === '' ? null : formulario.fechaFin,
    peso: aDecimal(formulario.peso),
    dependeDeId: aNumero(formulario.dependeDeId),
})

// Crear (tarea en null) o editar una tarea del plan vigente en elaboracion. El responsable es un miembro vigente
// del equipo del elemento; la dependencia, otra tarea del plan que no este cancelada
export const useTareaForm = (
    plan: PlanResponse,
    equipoId: number,
    tarea: TareaResponse | null,
    onGuardado: () => void,
) => {
    const { formulario, asignar, cambiar } = useFormulario<TareaFormulario>({
        titulo: tarea?.titulo ?? '',
        descripcion: tarea?.descripcion ?? '',
        responsableId: tarea ? String(tarea.responsableId) : '',
        fechaInicio: tarea?.fechaInicio ?? '',
        fechaFin: tarea?.fechaFin ?? '',
        peso: tarea ? String(tarea.peso) : '',
        dependeDeId: tarea?.dependeDeId ? String(tarea.dependeDeId) : '',
    })
    const [miembros, setMiembros] = useState<MiembroDelEquipo[]>([])
    const { guardar, errores, guardando } = useGuardar(onGuardado)

    useEffect(() => {
        let vigente = true
        combosApi
            .miembros(equipoId)
            .then((lista) => vigente && setMiembros(lista.filter((miembro) => miembro.usuarioActivo)))
            .catch((error: unknown) => vigente && avisarSiNoSeAviso(aErrorApi(error)))
        return () => {
            vigente = false
        }
    }, [equipoId])

    const opcionesResponsable = miembros.map(opcionMiembro)
    // Un responsable que ya no es miembro vigente se conserva para que el combo no quede vacio (el backend lo marca)
    if (tarea && !opcionesResponsable.some((opcion) => opcion.valor === String(tarea.responsableId))) {
        opcionesResponsable.push({ valor: String(tarea.responsableId), texto: tarea.responsableNombre })
    }

    const opcionesDependencia: Opcion[] = [
        SIN_DEPENDENCIA,
        ...plan.tareas
            .filter((otra) => otra.id !== tarea?.id && otra.estado !== 'CANCELADA')
            .map((otra) => ({
                valor: String(otra.id),
                texto: `${otra.titulo} · termina ${formatearFecha(otra.fechaFin)}`,
            })),
    ]

    // Lo que queda para llegar a 100, sin contar el peso actual de la tarea que se edita
    const usado = plan.sumaPesos - (tarea ? tarea.peso : 0)
    const ayudaPeso = `Quedan ${textoNumero(Math.max(100 - usado, 0))} de 100.`

    const enviar = () => {
        const peso = aDecimal(formulario.peso)
        const erroresLocales = peso !== null && Number.isNaN(peso) ? { peso: 'Debe ser un número' } : {}
        const solicitud = aSolicitud(formulario)
        void guardar(
            () => (tarea ? planesApi.actualizarTarea(tarea.id, solicitud) : planesApi.crearTarea(plan.id, solicitud)),
            erroresLocales,
        )
    }

    return {
        formulario,
        asignar,
        cambiar,
        opcionesResponsable,
        opcionesDependencia,
        ayudaPeso,
        errores,
        guardando,
        enviar,
    }
}
