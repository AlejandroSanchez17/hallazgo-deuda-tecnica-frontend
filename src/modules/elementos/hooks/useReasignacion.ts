import { useEffect, useState } from 'react'
import { useFormulario } from '../../../hooks/useFormulario'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import type { Opcion } from '../../../utils/opciones'
import { combosApi, elementosApi } from '../api'
import type { ElementoDetalleResponse, EquipoDisponible, ReasignacionFormulario } from '../types'
import { useGuardar } from './useGuardar'

// Se ofrecen los equipos activos con lider, sin el actual (el backend responde 422 "No hay cambio" con el mismo).
// El lider no se elige: el backend asigna al lider vigente del equipo destino
export const useReasignacion = (ficha: ElementoDetalleResponse, onReasignado: () => void) => {
    const { formulario, asignar, cambiar } = useFormulario<ReasignacionFormulario>({ equipoId: '', motivo: '' })
    const [equipos, setEquipos] = useState<EquipoDisponible[]>([])
    const { guardar, errores, guardando } = useGuardar(onReasignado)

    useEffect(() => {
        let vigente = true
        combosApi
            .equipos()
            .then(
                (lista) =>
                    vigente &&
                    setEquipos(lista.filter((equipo) => equipo.liderId !== null && equipo.id !== ficha.equipoId)),
            )
            .catch((error: unknown) => vigente && avisarSiNoSeAviso(aErrorApi(error)))
        return () => {
            vigente = false
        }
    }, [ficha.equipoId])

    const opcionesEquipo: Opcion[] = equipos.map((equipo) => ({ valor: String(equipo.id), texto: equipo.nombre }))

    const enviar = () =>
        void guardar(() =>
            elementosApi.reasignar(ficha.id, {
                equipoId: formulario.equipoId === '' ? null : Number(formulario.equipoId),
                motivo: formulario.motivo.trim(),
            }),
        )

    return {
        formulario,
        cambiar,
        elegirEquipo: (valor: string) => asignar('equipoId', valor),
        opcionesEquipo,
        errores,
        guardando,
        enviar,
    }
}
