import { aFechaApi } from '../../../../utils/formato'
import { equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
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
    const liderAnterior = equipo.liderNombre ?? 'El líder actual'
    // Sin lider anterior o sin elementos abiertos no hay nada que pasar
    const ofreceReasignar = !asignar && equipo.elementosAbiertos > 0
    const { ejecutar, errores, enviando } = useEnviar(
        async (formulario: UsuarioFechaFormulario) => {
            const mensaje = await equiposApi.cambiarLider(equipo.id, {
                usuarioId: formulario.usuarioId === '' ? null : Number(formulario.usuarioId),
                fecha: formulario.fecha ? aFechaApi(formulario.fecha) : undefined,
                reasignarElementos: ofreceReasignar ? formulario.reasignarElementos : undefined,
            })
            // El backend dice "Líder cambiado" tambien al asignar el primero
            return asignar ? 'Líder asignado' : mensaje
        },
        asignar ? 'Líder asignado' : 'Líder cambiado',
        onCambiado,
    )

    const ayuda = 'Solo usuarios con el permiso de liderar equipos.'
    const cantidad =
        equipo.elementosAbiertos === 1 ? '1 elemento abierto' : `${equipo.elementosAbiertos} elementos abiertos`
    return (
        <AsignacionForm
            titulo={asignar ? 'Asignar líder' : 'Cambiar líder'}
            etiquetaUsuario={asignar ? 'Líder' : 'Nuevo líder'}
            ayudaUsuario={asignar ? ayuda : `${ayuda} ${liderAnterior} sigue como miembro.`}
            etiquetaFecha="Desde"
            opciones={opciones}
            reasignarElementos={
                ofreceReasignar
                    ? {
                          etiqueta: `Pasar al nuevo líder los elementos abiertos (${cantidad})`,
                          ayuda: `Si lo desmarca, ${liderAnterior} sigue como responsable de sus elementos abiertos.`,
                      }
                    : undefined
            }
            errores={{ usuario: errores.usuarioId ?? errores.liderId, fecha: errores.fecha }}
            enviando={enviando}
            onCerrar={onCerrar}
            onEnviar={(formulario) => void ejecutar(formulario)}
        />
    )
}
