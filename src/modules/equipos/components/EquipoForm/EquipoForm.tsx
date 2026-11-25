import { FieldInput, FormModal, LargeTextArea, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { textoArea } from '../../../../utils/areas'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { areasApi, equiposApi } from '../../api'
import { useCandidatos } from '../../hooks/useCandidatos'
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
    // Con las gerencias activas incluidas: un equipo antiguo puede estar en una gerencia, y eso no es "inactiva"
    const { registros: activas, cargando } = useLista(areasApi.listar, 'activos')
    // Al editar no hace falta la lista de lideres
    const lideres = useCandidatos('NUEVO_EQUIPO', undefined, equipo === null)
    const { guardar, errores, guardando } = useGuardar({
        aSolicitud,
        crear: equiposApi.crear,
        actualizar,
        textos: TEXTOS.equipo,
        onGuardado,
    })

    // Areas y subareas; una gerencia no se ofrece
    const opcionesArea: Opcion[] = activas
        .filter((area) => area.tipo === 'AREA')
        .map((area) => ({ valor: String(area.id), texto: textoArea(area) }))
    // El valor actual que no viene en la lista se muestra para no perderlo al editar: inactivo, o una gerencia activa
    if (equipo && !opcionesArea.some((opcion) => opcion.valor === String(equipo.areaId))) {
        const actual = activas.find((area) => area.id === equipo.areaId)
        const texto = actual ? textoArea(actual) : cargando ? equipo.areaNombre : `${equipo.areaNombre} (inactiva)`
        opcionesArea.push({ valor: String(equipo.areaId), texto })
    }

    return (
        <FormModal
            open
            position="right"
            title={equipo ? 'Editar equipo' : 'Nuevo equipo'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, equipo?.id)}
        >
            <div style={rejillaFormulario}>
                <FieldInput label="Nombre" errorText={errores.nombre}>
                    <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
                </FieldInput>
                <FieldInput
                    label="Área"
                    errorText={errores.areaId}
                    helperText="Área o subárea a la que pertenece el equipo. Solo se listan las activas."
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
                            helperText="Solo usuarios con el permiso de liderar equipos. Entra como primer miembro."
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
    )
}
