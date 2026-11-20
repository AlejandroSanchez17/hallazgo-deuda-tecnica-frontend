import { aFechaApi } from '../../../../utils/formato'
import { equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
import { useConfirmarReasignarElementos } from '../../hooks/useConfirmarReasignarElementos'
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
    const asignar = equipo.liderId === null
    // Sin lider anterior no hay elementos que pasar
    const reasignacion = useConfirmarReasignarElementos(
        asignar ? 0 : equipo.elementosAbiertos,
        equipo.liderNombre ?? 'el líder anterior',
    )
    const { ejecutar, errores, enviando } = useEnviar(
        async (formulario: UsuarioFechaFormulario) => {
            const mensaje = await equiposApi.cambiarLider(equipo.id, {
                usuarioId: formulario.usuarioId === '' ? null : Number(formulario.usuarioId),
                fecha: formulario.fecha ? aFechaApi(formulario.fecha) : undefined,
                reasignarElementos: formulario.reasignarElementos,
            })
            // El backend dice "Líder cambiado" tambien al asignar el primero
            return asignar ? 'Líder asignado' : mensaje
        },
        asignar ? 'Líder asignado' : 'Líder cambiado',
        onCambiado,
    )

    // Si el lider anterior tiene elementos abiertos, pregunta si pasan al nuevo
    const alEnviar = (formulario: UsuarioFechaFormulario) => {
        const elegido = opciones.find((opcion) => opcion.valor === formulario.usuarioId)
        reasignacion.preguntarSiHaceFalta(
            elegido?.nombre ?? 'el nuevo líder',
            (reasignarElementos) => void ejecutar({ ...formulario, reasignarElementos }),
        )
    }

    const ayuda = 'Solo usuarios con el permiso de liderar equipos.'
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
            {reasignacion.dialogo}
        </>
    )
}
