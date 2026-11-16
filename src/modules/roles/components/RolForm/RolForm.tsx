import { FieldInput, FormModal, LargeTextArea, Text, TextInput, Toggle } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { rolesApi } from '../../api'
import { useGuardar } from '../../hooks/useGuardar'
import { TEXTOS } from '../../textos'
import type { RolFormulario, RolRequest, RolResponse } from '../../types'

const aSolicitud = (formulario: RolFormulario): RolRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    visibilidadGlobal: formulario.visibilidadGlobal,
})

interface RolFormProps {
    rol: RolResponse
    onCerrar: () => void
    onGuardado: () => void
}

// Los roles no se crean ni se borran, y su codigo no cambia
export const RolForm = ({ rol, onCerrar, onGuardado }: RolFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<RolFormulario>({
        nombre: rol.nombre,
        descripcion: rol.descripcion ?? '',
        visibilidadGlobal: rol.visibilidadGlobal,
    })
    const { guardar, errores, guardando } = useGuardar({
        aSolicitud,
        actualizar: rolesApi.actualizar,
        textos: TEXTOS.rol,
        onGuardado,
    })

    return (
        <FormModal
            open
            position="right"
            size="sm"
            title={`Editar rol (${rol.codigo})`}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, rol.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={60} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                <LargeTextArea maxLength={300} value={formulario.descripcion} onChange={cambiar('descripcion')} />
            </FieldInput>
            <div style={columna(4)}>
                <Toggle
                    label="Visibilidad global"
                    checked={formulario.visibilidadGlobal}
                    onChange={(global) => asignar('visibilidadGlobal', global)}
                />
                <Text variant="body-regular-small" as="p" style={textoSecundario}>
                    Con visibilidad global el rol ve los elementos de todos los equipos.
                </Text>
            </div>
        </FormModal>
    )
}
