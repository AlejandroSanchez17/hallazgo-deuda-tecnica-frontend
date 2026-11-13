import { spacing } from '@hnba/design-tokens'
import { FieldInput, FormModal, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { criticidadesApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { CriticidadFormulario, CriticidadRequest, CriticidadResponse, RolResumen } from '../../types'

const aNumero = (texto: string) => (texto.trim() === '' ? null : Number(texto))

const aSolicitud = (formulario: CriticidadFormulario): CriticidadRequest => ({
    nombre: formulario.nombre.trim(),
    plazoMeses: aNumero(formulario.plazoMeses),
    maxProrrogas: aNumero(formulario.maxProrrogas),
    rolApruebaPlanId: aNumero(formulario.rolApruebaPlanId),
    rolValidaCierreId: aNumero(formulario.rolValidaCierreId),
})

interface CriticidadFormProps {
    criticidad: CriticidadResponse
    roles: RolResumen[]
    onCerrar: () => void
    onGuardado: () => void
}

// Las criticidades no se crean ni se desactivan, y su nivel no se edita
export const CriticidadForm = ({ criticidad, roles, onCerrar, onGuardado }: CriticidadFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<CriticidadFormulario>({
        nombre: criticidad.nombre,
        plazoMeses: criticidad.plazoMeses.toString(),
        maxProrrogas: criticidad.maxProrrogas.toString(),
        rolApruebaPlanId: criticidad.rolApruebaPlan.id.toString(),
        rolValidaCierreId: criticidad.rolValidaCierre.id.toString(),
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        actualizar: criticidadesApi.actualizar,
        textos: TEXTOS.criticidad,
        onGuardado,
    })
    const opcionesRol: Opcion[] = roles.map((rol) => ({ valor: String(rol.id), texto: rol.nombre }))

    return (
        <FormModal
            open
            position="right"
            size="sm"
            title={`Editar criticidad (nivel ${criticidad.nivel})`}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, criticidad.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={30} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <FieldInput label="Plazo (meses)" errorText={errores.plazoMeses} helperText="Mínimo 1">
                    <TextInput type="number" min={1} value={formulario.plazoMeses} onChange={cambiar('plazoMeses')} />
                </FieldInput>
                <FieldInput label="Prórrogas máximas" errorText={errores.maxProrrogas} helperText="Mínimo 0">
                    <TextInput
                        type="number"
                        min={0}
                        value={formulario.maxProrrogas}
                        onChange={cambiar('maxProrrogas')}
                    />
                </FieldInput>
            </div>
            <FieldInput label="Rol que aprueba el plan" errorText={errores.rolApruebaPlanId}>
                <Select
                    options={opcionesRol}
                    value={opcionDe(opcionesRol, formulario.rolApruebaPlanId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    placeholder="Seleccione…"
                    onChange={(opcion) => asignar('rolApruebaPlanId', opcion.valor)}
                />
            </FieldInput>
            <FieldInput label="Rol que valida el cierre" errorText={errores.rolValidaCierreId}>
                <Select
                    options={opcionesRol}
                    value={opcionDe(opcionesRol, formulario.rolValidaCierreId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    placeholder="Seleccione…"
                    onChange={(opcion) => asignar('rolValidaCierreId', opcion.valor)}
                />
            </FieldInput>
        </FormModal>
    )
}
