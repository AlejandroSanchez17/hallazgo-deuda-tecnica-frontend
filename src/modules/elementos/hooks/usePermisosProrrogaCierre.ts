import { usePermiso } from '../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../store/sesionStore'
import type { UsuarioActual } from '../../../types/usuario.types'
import { PERMISOS } from '../../../utils/constants/permisos'
import type { ElementoResponse, EstadoElemento } from '../types'
import type { CierreResponse, ProrrogasDelElemento } from '../typesProrroga'

// El backend no acepta prorrogas con el cierre solicitado ni en los estados finales (422 en estado)
const ESTADOS_CON_PRORROGA: EstadoElemento[] = [
    'REGISTRADO',
    'PLAN_EN_ELABORACION',
    'PLAN_EN_APROBACION',
    'EN_EJECUCION',
]

const DE_LIDER: string[] = [PERMISOS.prorrogaSolicitar, PERMISOS.cierreSolicitar]

// Solo con alcance PROPIO hace falta pedir el equipo para saber si el usuario es su lider vigente
export const necesitaLiderParaSolicitar = (usuario: UsuarioActual | null) =>
    usuario?.permisos.some((permiso) => DE_LIDER.includes(permiso.codigo) && permiso.alcance === 'PROPIO') ?? false

// liderDelEquipo: liderId del equipo del elemento (pide el lider vigente del equipo, no el del elemento)
export const usePermisosProrrogaCierre = (
    elemento: ElementoResponse | null,
    liderDelEquipo: number | null | undefined,
) => {
    const usuario = useSesionStore((estado) => estado.usuario)

    const comoLider = (codigo: string) => {
        const permiso = usuario?.permisos.find((p) => p.codigo === codigo)
        return (
            permiso !== undefined &&
            (permiso.alcance === 'TODO' || (liderDelEquipo !== undefined && liderDelEquipo === usuario?.id))
        )
    }
    const validar = usePermiso(PERMISOS.cierreValidar)
    const aprobar = usePermiso(PERMISOS.prorrogaAprobar)
    const estado = elemento?.estado

    return {
        veProrrogas: usePermiso(PERMISOS.prorrogaLeer),
        veCierre: usePermiso(PERMISOS.cierreLeer),
        puedePedirProrroga: (resumen: ProrrogasDelElemento | null) =>
            resumen !== null &&
            !resumen.hayPendiente &&
            estado !== undefined &&
            ESTADOS_CON_PRORROGA.includes(estado) &&
            comoLider(PERMISOS.prorrogaSolicitar),
        // Hoy solo Gerencia de TI, tambien las adicionales
        puedeResolverProrroga: aprobar,
        // Lo demas (tareas, evidencias, prorroga pendiente) lo revisa el backend y lo devuelve todo junto
        puedePedirCierre: estado === 'EN_EJECUCION' && comoLider(PERMISOS.cierreSolicitar),
        // Un hallazgo lo valida el Auditor; una deuda tecnica, el rol de su criticidad
        puedeValidarCierre: (cierre: CierreResponse) =>
            validar &&
            estado === 'CIERRE_SOLICITADO' &&
            cierre.resultado === 'PENDIENTE' &&
            (usuario?.roles.some((rol) => rol.codigo === cierre.rolRequeridoCodigo) ?? false),
    }
}
