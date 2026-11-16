import { FieldInput, FormModal, LargeTextArea, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { origenesApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { OrigenFormulario, OrigenRequest, OrigenResponse } from '../../types'

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
        <FormModal
            open
            position="right"
            title={origen ? 'Editar origen' : 'Nuevo origen'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, origen?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={80} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                <LargeTextArea maxLength={300} value={formulario.descripcion} onChange={cambiar('descripcion')} />
            </FieldInput>
        </FormModal>
    )
}
