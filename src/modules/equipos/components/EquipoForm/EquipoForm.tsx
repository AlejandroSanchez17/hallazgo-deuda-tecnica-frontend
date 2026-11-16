import { FieldInput, FormModal, LargeTextArea, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { areasApi, equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
import { useConfirmarRolLider } from '../../hooks/useConfirmarRolLider'
import { useGuardar } from '../../hooks/useGuardar'
import { useLista } from '../../hooks/useLista'
import { TEXTOS } from '../../textos'
import type { EquipoCrearRequest, EquipoFormulario, EquipoResponse } from '../../types'

const aNumero = (valor: string) => (valor === '' ? null : Number(valor))

const aSolicitud = (formulario: EquipoFormulario): EquipoCrearRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    areaId: aNumero(formulario.areaId),
    liderId: aNumero(formulario.liderId),
    asignarRolLider: formulario.asignarRolLider || undefined,
})

// Al editar no se envia el lider: se cambia aparte, desde el detalle del equipo
const actualizar = (id: number, { nombre, descripcion, areaId }: EquipoCrearRequest) =>
    equiposApi.actualizar(id, { nombre, descripcion, areaId })

interface EquipoFormProps {
    equipo: EquipoResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const EquipoForm = ({ equipo, onCerrar, onGuardado }: EquipoFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<EquipoFormulario>({
        nombre: equipo?.nombre ?? '',
        descripcion: equipo?.descripcion ?? '',
        areaId: equipo?.areaId.toString() ?? '',
        liderId: '',
    })
    const { registros: areasActivas } = useLista(areasApi.listar, 'activos')
    // Al editar no hace falta la lista de lideres
    const lideres = useCandidatos('NUEVO_EQUIPO', undefined, equipo === null)
    const { confirmarSiHaceFalta, dialogo } = useConfirmarRolLider()
    const { guardar, errores, guardando } = useGuardar({
        aSolicitud,
        crear: equiposApi.crear,
        actualizar,
        textos: TEXTOS.equipo,
        onGuardado,
    })

    const opcionesArea: Opcion[] = areasActivas.map((area) => ({ valor: String(area.id), texto: area.nombre }))
    // Si el area actual esta inactiva no viene en la lista; se muestra para no perderla al editar
    if (equipo && !opcionesArea.some((opcion) => opcion.valor === String(equipo.areaId))) {
        opcionesArea.push({ valor: String(equipo.areaId), texto: `${equipo.areaNombre} (inactiva)` })
    }

    const alGuardar = () => {
        if (equipo) {
            void guardar(formulario, equipo.id)
            return
        }
        const lider = lideres.find((opcion) => opcion.valor === formulario.liderId)
        confirmarSiHaceFalta(lider, (asignarRolLider) => void guardar({ ...formulario, asignarRolLider }))
    }

    return (
        <>
            <FormModal
                open
                position="right"
                title={equipo ? 'Editar equipo' : 'Nuevo equipo'}
                loading={guardando}
                onClose={onCerrar}
                onSubmit={alGuardar}
            >
                <div style={rejillaFormulario}>
                    <FieldInput label="Nombre" errorText={errores.nombre}>
                        <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
                    </FieldInput>
                    <FieldInput
                        label="Área"
                        errorText={errores.areaId}
                        helperText="Área a la que pertenece el equipo. Solo se listan las áreas activas."
                    >
                        <Select
                            options={opcionesArea}
                            value={opcionDe(opcionesArea, formulario.areaId)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            searchable
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('areaId', opcion.valor)}
                        />
                    </FieldInput>
                    {!equipo && (
                        <div style={anchoCompleto}>
                            <FieldInput
                                label="Líder"
                                errorText={errores.liderId}
                                helperText="Usuario activo sin equipo, con el rol Líder técnico o Miembro de equipo (a este se le asignará el rol). Entra como primer miembro."
                            >
                                <Select
                                    options={lideres}
                                    value={opcionDe(lideres, formulario.liderId)}
                                    getLabel={textoDeOpcion}
                                    getValue={valorDeOpcion}
                                    searchable
                                    placeholder="Seleccione…"
                                    onChange={(opcion) => asignar('liderId', opcion.valor)}
                                />
                            </FieldInput>
                        </div>
                    )}
                    <div style={anchoCompleto}>
                        <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                            <LargeTextArea
                                maxLength={300}
                                value={formulario.descripcion}
                                onChange={cambiar('descripcion')}
                            />
                        </FieldInput>
                    </div>
                </div>
            </FormModal>
            {dialogo}
        </>
    )
}
