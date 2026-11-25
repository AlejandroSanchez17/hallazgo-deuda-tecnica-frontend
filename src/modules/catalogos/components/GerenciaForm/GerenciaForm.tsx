import { FieldInput, FormModal, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { gerenciasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaRequest, AreaResponse, GerenciaFormulario } from '../../types'

// Una gerencia no tiene padre
const aSolicitud = (formulario: GerenciaFormulario): AreaRequest => ({
    nombre: formulario.nombre.trim(),
    tipo: 'GERENCIA',
    areaPadreId: null,
})

interface GerenciaFormProps {
    gerencia: AreaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const GerenciaForm = ({ gerencia, onCerrar, onGuardado }: GerenciaFormProps) => {
    const { formulario, cambiar } = useFormulario<GerenciaFormulario>({ nombre: gerencia?.nombre ?? '' })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: gerenciasApi.crear,
        actualizar: gerenciasApi.actualizar,
        textos: TEXTOS.gerencia,
        onGuardado,
    })

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={gerencia ? 'Editar gerencia' : 'Nueva gerencia'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, gerencia?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
        </FormModal>
    )
}
