import { FieldInput, FormModal, LargeTextArea, Text, TextInput, Toggle } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { categoriasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { CategoriaFormulario, CategoriaRequest, CategoriaResponse } from '../../types'

const aSolicitud = (formulario: CategoriaFormulario): CategoriaRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    restringida: formulario.restringida,
})

interface CategoriaFormProps {
    categoria: CategoriaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const CategoriaForm = ({ categoria, onCerrar, onGuardado }: CategoriaFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<CategoriaFormulario>({
        nombre: categoria?.nombre ?? '',
        descripcion: categoria?.descripcion ?? '',
        restringida: categoria?.restringida ?? false,
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: categoriasApi.crear,
        actualizar: categoriasApi.actualizar,
        textos: TEXTOS.categoria,
        onGuardado,
    })

    return (
        <FormModal
            open
            position="right"
            size="sm"
            title={categoria ? 'Editar categoría de deuda' : 'Nueva categoría de deuda'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, categoria?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={80} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                <LargeTextArea maxLength={300} value={formulario.descripcion} onChange={cambiar('descripcion')} />
            </FieldInput>
            <div style={columna(4)}>
                <Toggle
                    label="Restringida"
                    checked={formulario.restringida}
                    onChange={(restringida) => asignar('restringida', restringida)}
                />
                <Text variant="body-regular-small" as="p" style={textoSecundario}>
                    La deuda de una categoría restringida solo la ven los roles con permiso para ello.
                </Text>
            </div>
        </FormModal>
    )
}
