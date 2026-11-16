import { aFechaApi } from '../../../../utils/formato'
import { equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
import { useConfirmarRolLider } from '../../hooks/useConfirmarRolLider'
import { useEnviar } from '../../hooks/useEnviar'
import type { EquipoDetalleResponse, UsuarioFechaFormulario } from '../../types'
import { AsignacionForm } from '../AsignacionForm/AsignacionForm'

interface LiderFormProps {
    equipo: EquipoDetalleResponse
    onCerrar: () => void
    onCambiado: () => void
}

// Asigna un lider (equipo reactivado, sin lider) o cambia el actual; el anterior sigue como miembro
export const LiderForm = ({ equipo, onCerrar, onCambiado }: LiderFormProps) => {
    const opciones = useCandidatos('LIDER', equipo.id)
    const { confirmarSiHaceFalta, dialogo } = useConfirmarRolLider()
    const asignar = equipo.liderId === null
    const { ejecutar, errores, enviando } = useEnviar(
        (formulario: UsuarioFechaFormulario) =>
            equiposApi.cambiarLider(equipo.id, {
                usuarioId: formulario.usuarioId === '' ? null : Number(formulario.usuarioId),
                fecha: formulario.fecha ? aFechaApi(formulario.fecha) : undefined,
                asignarRolLider: formulario.asignarRolLider || undefined,
            }),
        asignar ? 'Líder asignado' : 'Líder cambiado',
        onCambiado,
    )

    const alEnviar = (formulario: UsuarioFechaFormulario) => {
        const elegido = opciones.find((opcion) => opcion.valor === formulario.usuarioId)
        confirmarSiHaceFalta(elegido, (asignarRolLider) => void ejecutar({ ...formulario, asignarRolLider }))
    }

    const ayuda = 'Usuario activo sin equipo con el rol Líder técnico, o un miembro del equipo (se le asignará el rol).'
    return (
        <>
            <AsignacionForm
                titulo={asignar ? 'Asignar líder' : 'Cambiar líder'}
                etiquetaUsuario={asignar ? 'Líder' : 'Nuevo líder'}
                ayudaUsuario={
                    asignar ? ayuda : `${ayuda} ${equipo.liderNombre ?? 'El líder actual'} sigue como miembro.`
                }
                etiquetaFecha="Desde"
                opciones={opciones}
                errores={{ usuario: errores.usuarioId ?? errores.liderId, fecha: errores.fecha }}
                enviando={enviando}
                onCerrar={onCerrar}
                onEnviar={alEnviar}
            />
            {dialogo}
        </>
    )
}
