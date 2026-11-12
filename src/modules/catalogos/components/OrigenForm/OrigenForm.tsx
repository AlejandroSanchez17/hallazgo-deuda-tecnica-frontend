import { AreaTexto } from '../../../../components/ui/AreaTexto/AreaTexto'
import { Campo } from '../../../../components/ui/Campo/Campo'
import { useFormulario } from '../../../../hooks/useFormulario'
import { origenesApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { OrigenFormulario, OrigenRequest, OrigenResponse } from '../../types'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'

const aSolicitud = (formulario: OrigenFormulario): OrigenRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
})

interface OrigenFormProps {
    origen: OrigenResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const OrigenForm = ({ origen, onCerrar, onGuardado }: OrigenFormProps) => {
    const { formulario, cambiar } = useFormulario<OrigenFormulario>({
        nombre: origen?.nombre ?? '',
        descripcion: origen?.descripcion ?? '',
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: origenesApi.crear,
        actualizar: origenesApi.actualizar,
        textos: TEXTOS.origen,
        onGuardado,
    })

    return (
        <ModalFormulario
            titulo={origen ? 'Editar origen' : 'Nuevo origen'}
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(formulario, origen?.id)}
        >
            <Campo
                etiqueta="Nombre"
                obligatorio
                maxLength={80}
                value={formulario.nombre}
                onChange={cambiar('nombre')}
                error={errores.nombre}
            />
            <AreaTexto
                etiqueta="Descripción"
                maxLength={300}
                value={formulario.descripcion}
                onChange={cambiar('descripcion')}
                error={errores.descripcion}
                ayuda="Opcional"
            />
        </ModalFormulario>
    )
}
