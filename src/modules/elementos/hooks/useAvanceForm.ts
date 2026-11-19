import { useFormulario } from '../../../hooks/useFormulario'
import type { ErroresCampo } from '../../../utils/erroresCampo'
import { planesApi } from '../apiPlan'
import { aDecimal, ESTADO_TAREA } from '../textosPlan'
import type { AvanceFormulario, EstadoAvance, EstadoTarea } from '../typesPlan'
import { useGuardar } from './useGuardar'

// Lo que hace falta de la tarea: sirve para las del plan y para las de Mis tareas
export interface TareaConAvance {
    id: number
    planId: number
    titulo: string
    estado: EstadoTarea
    avance: number
}

const ESTADOS: EstadoAvance[] = ['PENDIENTE', 'EN_PROGRESO', 'BLOQUEADA', 'FINALIZADA']

// El porcentaje lo fija el estado en Pendiente (0) y Finalizada (100)
const FIJO: Partial<Record<EstadoAvance, string>> = { PENDIENTE: '0', FINALIZADA: '100' }

export const OPCIONES_ESTADO_AVANCE = ESTADOS.map((estado) => ({ valor: estado, texto: ESTADO_TAREA[estado].texto }))

const erroresDe = (formulario: AvanceFormulario): ErroresCampo => {
    const porcentaje = aDecimal(formulario.porcentaje)
    if (porcentaje !== null && Number.isNaN(porcentaje)) {
        return { porcentaje: 'Debe ser un número' }
    }
    if (
        porcentaje !== null &&
        porcentaje >= 100 &&
        (formulario.estado === 'EN_PROGRESO' || formulario.estado === 'BLOQUEADA')
    ) {
        return { porcentaje: `Menor que 100 en ${ESTADO_TAREA[formulario.estado].texto}` }
    }
    return {}
}

// Estado, porcentaje y comentario cuadran como pide el backend; lo demas (comentario vacio, dependencias) lo marca el
// backend
export const useAvanceForm = (tarea: TareaConAvance, onRegistrado: () => void) => {
    const { formulario, asignar, cambiar } = useFormulario<AvanceFormulario>({
        estado: tarea.estado,
        porcentaje: String(tarea.avance),
        comentario: '',
    })
    const { guardar, errores, guardando } = useGuardar(onRegistrado)

    const elegirEstado = (estado: string) => {
        asignar('estado', estado)
        const fijo = FIJO[estado as EstadoAvance]
        if (fijo !== undefined) {
            asignar('porcentaje', fijo)
        } else if (formulario.estado in FIJO) {
            // Al salir de Pendiente o Finalizada se vuelve al avance actual, si cabe en el estado nuevo
            asignar('porcentaje', tarea.avance < 100 ? String(tarea.avance) : '')
        }
    }

    const enviar = () => {
        void guardar(
            () =>
                planesApi.registrarAvance(tarea.id, {
                    estado: formulario.estado === '' ? null : (formulario.estado as EstadoAvance),
                    porcentaje: aDecimal(formulario.porcentaje),
                    comentario: formulario.comentario.trim(),
                }),
            erroresDe(formulario),
        )
    }

    return {
        formulario,
        cambiar,
        elegirEstado,
        porcentajeFijo: formulario.estado in FIJO,
        bloqueada: formulario.estado === 'BLOQUEADA',
        errores,
        guardando,
        enviar,
    }
}
