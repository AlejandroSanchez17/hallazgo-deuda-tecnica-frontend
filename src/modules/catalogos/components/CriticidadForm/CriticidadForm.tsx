import { FieldInput, FormModal, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { criticidadesApi, rolesApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
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
    // null: criticidad nueva
    criticidad: CriticidadResponse | null
    // Los niveles que todavia no existen; solo se ofrecen al crear
    nivelesLibres: number[]
    onCerrar: () => void
    onGuardado: () => void
}

// El nivel se elige al crear; despues se muestra pero no se edita
export const CriticidadForm = ({ criticidad, nivelesLibres, onCerrar, onGuardado }: CriticidadFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<CriticidadFormulario>({
        nombre: criticidad?.nombre ?? '',
        nivel: criticidad?.nivel.toString() ?? '',
        plazoMeses: criticidad?.plazoMeses.toString() ?? '',
        maxProrrogas: criticidad?.maxProrrogas.toString() ?? '',
        rolApruebaPlanId: criticidad?.rolApruebaPlan.id.toString() ?? '',
        rolValidaCierreId: criticidad?.rolValidaCierre.id.toString() ?? '',
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: (solicitud) => criticidadesApi.crear({ ...solicitud, nivel: aNumero(formulario.nivel) }),
        actualizar: criticidadesApi.actualizar,
        textos: TEXTOS.criticidad,
        onGuardado,
    })
    const { registros: rolesActivos } = useListaCatalogo(rolesApi.listar, 'activos')
    const rolesActuales = criticidad ? [criticidad.rolApruebaPlan, criticidad.rolValidaCierre] : []
    // Los roles actuales van siempre en la lista, aunque los roles aun no hayan cargado
    const roles = new Map<number, RolResumen>([...rolesActivos, ...rolesActuales].map((rol) => [rol.id, rol]))
    const opcionesRol: Opcion[] = [...roles.values()].map((rol) => ({ valor: String(rol.id), texto: rol.nombre }))
    const niveles = criticidad ? [criticidad.nivel] : nivelesLibres
    const opcionesNivel: Opcion[] = niveles.map((nivel) => ({ valor: String(nivel), texto: `Nivel ${nivel}` }))

    return (
        <FormModal
            open
            position="right"
            title={criticidad ? 'Editar criticidad' : 'Nueva criticidad'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, criticidad?.id)}
        >
            <div style={rejillaFormulario}>
                <div style={anchoCompleto}>
                    <FieldInput label="Nombre" errorText={errores.nombre}>
                        <TextInput maxLength={30} value={formulario.nombre} onChange={cambiar('nombre')} />
                    </FieldInput>
                </div>
                <div style={anchoCompleto}>
                    <FieldInput
                        label="Nivel"
                        errorText={errores.nivel}
                        helperText={criticidad ? 'El nivel no cambia.' : 'Solo los niveles que aún no existen.'}
                    >
                        <Select
                            options={opcionesNivel}
                            value={opcionDe(opcionesNivel, formulario.nivel)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            disabled={criticidad !== null}
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('nivel', opcion.valor)}
                        />
                    </FieldInput>
                </div>
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
            </div>
        </FormModal>
    )
}
