import { aFechaApi } from '../../../../utils/formato'
import { equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
import { useEnviar } from '../../hooks/useEnviar'
import type { EquipoDetalleResponse, UsuarioFechaFormulario } from '../../types'
import { AsignacionForm } from '../AsignacionForm/AsignacionForm'

interface MiembroFormProps {
    equipo: EquipoDetalleResponse
    onCerrar: () => void
    onAgregado: () => void
}

export const MiembroForm = ({ equipo, onCerrar, onAgregado }: MiembroFormProps) => {
    const opciones = useCandidatos('MIEMBRO', equipo.id)
    const { ejecutar, errores, enviando } = useEnviar(
        (formulario: UsuarioFechaFormulario) =>
            equiposApi.agregarMiembro(equipo.id, {
                usuarioId: formulario.usuarioId === '' ? null : Number(formulario.usuarioId),
                fechaIngreso: formulario.fecha ? aFechaApi(formulario.fecha) : undefined,
            }),
        'Miembro agregado',
        onAgregado,
    )

    return (
        <AsignacionForm
            titulo="Agregar miembro"
            etiquetaUsuario="Usuario"
            ayudaUsuario="Usuario activo con el permiso de participar en equipos que no esté en este ni en otro equipo."
            etiquetaFecha="Fecha de ingreso"
            opciones={opciones}
            errores={{ usuario: errores.usuarioId, fecha: errores.fechaIngreso }}
            enviando={enviando}
            onCerrar={onCerrar}
            onEnviar={(formulario) => void ejecutar(formulario)}
        />
    )
}
