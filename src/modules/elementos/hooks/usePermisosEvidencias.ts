import { useEffect, useState } from 'react'
import { tienePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import { PERMISOS } from '../../../utils/constants/permisos'
import { combosApi } from '../api'
import { claveDestino, destinoDeEvidencia } from '../textosEvidencia'
import type { EstadoElemento, MiembroDelEquipo } from '../types'
import type { DestinoSubida, EvidenciaResponse } from '../typesEvidencia'
import type { PlanResponse } from '../typesPlan'

// Lo que hace falta del elemento: sirve con la ficha del detalle y con la de la pagina del plan
export interface ElementoDeEvidencias {
    id: number
    estado: EstadoElemento
    equipoId: number
}

interface Miembros {
    equipoId: number
    lista: MiembroDelEquipo[]
}

// plan: el vigente (o null si no hay o no se puede ver). Con alcance PROPIO se piden los miembros del equipo: en el
// plan y el elemento sube cualquier miembro vigente; en una tarea, su responsable o el lider del equipo (BE-13)
export const usePermisosEvidencias = (elemento: ElementoDeEvidencias, plan: PlanResponse | null) => {
    const usuario = useSesionStore((estado) => estado.usuario)
    const crear = usuario?.permisos.find((permiso) => permiso.codigo === PERMISOS.evidenciaCrear)
    const conAlcancePropio = crear?.alcance === 'PROPIO'
    const [miembros, setMiembros] = useState<Miembros | null>(null)

    useEffect(() => {
        if (!conAlcancePropio) {
            return
        }
        let vigente = true
        combosApi
            .miembros(elemento.equipoId)
            .then((lista) => vigente && setMiembros({ equipoId: elemento.equipoId, lista }))
            .catch(() => vigente && setMiembros({ equipoId: elemento.equipoId, lista: [] }))
        return () => {
            vigente = false
        }
    }, [conAlcancePropio, elemento.equipoId])

    const delEquipo = miembros?.equipoId === elemento.equipoId ? miembros.lista : []
    const todo = crear?.alcance === 'TODO'
    const esMiembro = todo || delEquipo.some((miembro) => miembro.usuarioId === usuario?.id)
    const esLider = todo || delEquipo.some((miembro) => miembro.esLider && miembro.usuarioId === usuario?.id)
    const abierto = elemento.estado !== 'CERRADO' && elemento.estado !== 'ANULADO'
    const planVigente = plan?.vigente ? plan : null

    const destinos: DestinoSubida[] = []
    if (crear && abierto && esMiembro) {
        destinos.push({ destino: 'ELEMENTO', id: elemento.id, texto: 'Elemento' })
        if (planVigente) {
            destinos.push({ destino: 'PLAN', id: planVigente.id, texto: `Plan v${planVigente.version}` })
        }
    }
    // Las tareas, solo con el plan vigente aprobado y si no estan canceladas (una finalizada si admite)
    if (crear && abierto && planVigente?.estado === 'APROBADO') {
        planVigente.tareas
            .filter((tarea) => tarea.estado !== 'CANCELADA' && (esLider || tarea.responsableId === usuario?.id))
            .forEach((tarea) => destinos.push({ destino: 'TAREA', id: tarea.id, texto: `Tarea: ${tarea.titulo}` }))
    }

    const claves = new Set(destinos.map(claveDestino))
    const puedeSubirEn = (destino: { destino: string; id: number | null }) => claves.has(claveDestino(destino))

    return {
        puedeDescargar: tienePermiso(usuario, PERMISOS.evidenciaDescargar),
        destinos,
        puedeSubirEn,
        // Una reemplazada no se reemplaza otra vez; la nueva hereda el destino
        puedeReemplazar: (evidencia: EvidenciaResponse) =>
            evidencia.estado === 'VIGENTE' && puedeSubirEn(destinoDeEvidencia(evidencia)),
    }
}
