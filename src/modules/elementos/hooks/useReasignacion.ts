import { useEffect, useState } from 'react'
import { useFormulario } from '../../../hooks/useFormulario'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import type { Opcion } from '../../../utils/opciones'
import { combosApi, elementosApi } from '../api'
import type { ElementoDetalleResponse, EquipoDisponible, MiembroDelEquipo, ReasignacionFormulario } from '../types'
import { useGuardar } from './useGuardar'

interface Miembros {
    equipoId: string
    lista: MiembroDelEquipo[]
}

const opcionMiembro = (miembro: MiembroDelEquipo): Opcion => ({
    valor: String(miembro.usuarioId),
    texto: miembro.esLider ? `${miembro.usuarioNombre} · líder del equipo` : miembro.usuarioNombre,
})

// Con cambiaEquipo (alcance TODO) se ofrecen los equipos activos con lider; si no, solo el del elemento
export const useReasignacion = (ficha: ElementoDetalleResponse, cambiaEquipo: boolean, onReasignado: () => void) => {
    const { formulario, asignar, cambiar } = useFormulario<ReasignacionFormulario>({
        equipoId: String(ficha.equipoId),
        liderId: '',
        motivo: '',
    })
    const [equipos, setEquipos] = useState<EquipoDisponible[]>([])
    const [miembros, setMiembros] = useState<Miembros | null>(null)
    const { guardar, errores, guardando } = useGuardar(onReasignado)

    useEffect(() => {
        if (!cambiaEquipo) {
            return
        }
        let vigente = true
        combosApi
            .equipos()
            .then((lista) => vigente && setEquipos(lista.filter((equipo) => equipo.liderId !== null)))
            .catch((error: unknown) => vigente && avisarSiNoSeAviso(aErrorApi(error)))
        return () => {
            vigente = false
        }
    }, [cambiaEquipo])

    // Al elegir el equipo se piden sus miembros vigentes y queda elegido su lider
    const equipoId = formulario.equipoId
    useEffect(() => {
        if (equipoId === '') {
            return
        }
        let vigente = true
        combosApi
            .miembros(Number(equipoId))
            .then((lista) => {
                if (vigente) {
                    const activos = lista.filter((miembro) => miembro.usuarioActivo)
                    setMiembros({ equipoId, lista: activos })
                    const lider = activos.find((miembro) => miembro.esLider)
                    asignar('liderId', lider ? String(lider.usuarioId) : '')
                }
            })
            .catch((error: unknown) => vigente && avisarSiNoSeAviso(aErrorApi(error)))
        return () => {
            vigente = false
        }
        // asignar cambia en cada render; solo importa el equipo elegido
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipoId])

    const miembrosDelEquipo = miembros?.equipoId === equipoId ? miembros.lista : []
    const opcionesEquipo: Opcion[] = cambiaEquipo
        ? equipos.map((equipo) => ({ valor: String(equipo.id), texto: equipo.nombre }))
        : [{ valor: String(ficha.equipoId), texto: ficha.equipoNombre }]

    const enviar = () => {
        const liderDelEquipo = miembrosDelEquipo.find((miembro) => miembro.esLider)
        // Sin liderId el backend toma al lider vigente del equipo
        const liderId =
            formulario.liderId === '' || formulario.liderId === String(liderDelEquipo?.usuarioId)
                ? undefined
                : Number(formulario.liderId)
        void guardar(() =>
            elementosApi.reasignar(ficha.id, {
                equipoId: formulario.equipoId === '' ? null : Number(formulario.equipoId),
                liderId,
                motivo: formulario.motivo.trim(),
            }),
        )
    }

    return {
        formulario,
        cambiar,
        elegirEquipo: (valor: string) => asignar('equipoId', valor),
        elegirLider: (valor: string) => asignar('liderId', valor),
        opcionesEquipo,
        opcionesLider: miembrosDelEquipo.map(opcionMiembro),
        errores,
        guardando,
        enviar,
    }
}
