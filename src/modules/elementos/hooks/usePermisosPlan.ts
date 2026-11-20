import { useSesionStore } from '../../../store/sesionStore'
import type { UsuarioActual } from '../../../types/usuario.types'
import { PERMISOS } from '../../../utils/constants/permisos'
import type { ElementoDetalleResponse } from '../types'
import type { PlanResponse, TareaResponse } from '../typesPlan'

export const tareaAbierta = (tarea: { estado: TareaResponse['estado'] }) =>
    tarea.estado !== 'FINALIZADA' && tarea.estado !== 'CANCELADA'

// Permisos para armar y enviar el plan; con alcance PROPIO solo los usa el lider vigente del equipo del elemento
const DE_GESTION: string[] = [
    PERMISOS.planCrear,
    PERMISOS.planActualizar,
    PERMISOS.planSolicitar,
    PERMISOS.tareaCrear,
    PERMISOS.tareaActualizar,
    PERMISOS.tareaDesactivar,
]

// Solo con alcance PROPIO hace falta pedir el equipo para conocer a su lider
export const necesitaLiderDelEquipo = (usuario: UsuarioActual | null) =>
    usuario?.permisos.some((permiso) => DE_GESTION.includes(permiso.codigo) && permiso.alcance === 'PROPIO') ?? false

// liderDelEquipo: liderId del equipo del elemento (no el del elemento, que puede ser un miembro designado)
export const usePermisosPlan = (
    ficha: ElementoDetalleResponse | null,
    plan: PlanResponse | null,
    liderDelEquipo: number | null | undefined,
) => {
    const usuario = useSesionStore((estado) => estado.usuario)

    const puede = (codigo: string) => {
        const permiso = usuario?.permisos.find((p) => p.codigo === codigo)
        return (
            permiso !== undefined &&
            (permiso.alcance === 'TODO' || (liderDelEquipo !== undefined && liderDelEquipo === usuario?.id))
        )
    }

    const vigente = plan?.vigente ?? false
    const enElaboracion = vigente && plan?.estado === 'EN_ELABORACION'
    const aprobado = vigente && plan?.estado === 'APROBADO'
    const actualizar = usuario?.permisos.find((p) => p.codigo === PERMISOS.tareaActualizar)

    // Con PROPIO registran el responsable de la tarea y el lider vigente del equipo (BE-12)
    const puedeAvance = (tarea: TareaResponse) =>
        aprobado &&
        tareaAbierta(tarea) &&
        actualizar !== undefined &&
        (actualizar.alcance === 'TODO' || tarea.responsableId === usuario?.id || liderDelEquipo === usuario?.id)

    // Con el plan aprobado el peso de la cancelada se reparte: la ultima tarea no cancelada no se cancela (422)
    const otrasNoCanceladas = (tarea: TareaResponse) =>
        plan?.tareas.some((otra) => otra.id !== tarea.id && otra.estado !== 'CANCELADA') ?? false
    const aprobacion = plan?.ultimaAprobacion
    // El rol no siempre tiene codigo (los creados desde el sistema no lo tienen) y la respuesta solo trae su nombre,
    // que es unico: se compara por el
    const tieneElRol = usuario?.roles.some((rol) => rol.nombre === aprobacion?.rolRequeridoNombre) ?? false

    return {
        // El backend solo crea el plan con el elemento Registrado
        puedeCrearPlan: plan === null && ficha?.estado === 'REGISTRADO' && puede(PERMISOS.planCrear),
        puedeEditarPlan: enElaboracion && puede(PERMISOS.planActualizar),
        puedeEnviar: enElaboracion && puede(PERMISOS.planSolicitar),
        // Aprueba o devuelve el rol que pide la criticidad, con el permiso de aprobar planes
        puedeResolver:
            vigente &&
            plan?.estado === 'EN_APROBACION' &&
            aprobacion?.resultado === 'PENDIENTE' &&
            tieneElRol &&
            usuario?.permisos.some((p) => p.codigo === PERMISOS.planAprobar) === true,
        puedeNuevaVersion:
            vigente &&
            plan?.estado === 'APROBADO' &&
            ficha?.estado === 'EN_EJECUCION' &&
            puede(PERMISOS.planActualizar),
        puedeCrearTarea: enElaboracion && puede(PERMISOS.tareaCrear),
        // Sin el permiso no se dibuja la columna; las tareas finalizadas o canceladas quedan deshabilitadas
        muestraEditarTarea: enElaboracion && puede(PERMISOS.tareaActualizar),
        muestraCancelarTarea: (enElaboracion || aprobado) && puede(PERMISOS.tareaDesactivar),
        puedeCancelarTarea: (tarea: TareaResponse) =>
            tareaAbierta(tarea) && (enElaboracion || otrasNoCanceladas(tarea)),
        // La columna Avance solo se dibuja si el usuario puede registrar en alguna tarea
        muestraAvance: plan?.tareas.some(puedeAvance) ?? false,
        puedeAvance,
    }
}
