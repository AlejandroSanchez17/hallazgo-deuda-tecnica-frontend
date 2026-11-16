import { FieldInput, FormModal, MultiSelect, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { rolesApi, usuariosApi } from '../../api'
import { useGuardar } from '../../hooks/useGuardar'
import { useLista } from '../../hooks/useLista'
import { TEXTOS } from '../../textos'
import type { UsuarioFormulario, UsuarioRequest, UsuarioResponse } from '../../types'

const aSolicitud = (formulario: UsuarioFormulario): UsuarioRequest => ({
    nombre: formulario.nombre.trim(),
    correo: formulario.correo.trim(),
    usuarioRed: formulario.usuarioRed.trim(),
    rolIds: formulario.rolIds.map(Number),
})

interface UsuarioFormProps {
    usuario: UsuarioResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const UsuarioForm = ({ usuario, onCerrar, onGuardado }: UsuarioFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<UsuarioFormulario>({
        nombre: usuario?.nombre ?? '',
        correo: usuario?.correo ?? '',
        usuarioRed: usuario?.usuarioRed ?? '',
        rolIds: usuario?.roles.map((rol) => String(rol.id)) ?? [],
    })
    const { registros: rolesActivos } = useLista(rolesApi.listar, 'activos')
    const { guardar, errores, guardando } = useGuardar({
        aSolicitud,
        crear: usuariosApi.crear,
        actualizar: usuariosApi.actualizar,
        textos: TEXTOS.usuario,
        onGuardado,
    })

    const opciones: Opcion[] = rolesActivos.map((rol) => ({ valor: String(rol.id), texto: rol.nombre }))
    // Un rol inactivo que el usuario ya tiene se puede conservar, pero no asignar de nuevo
    usuario?.roles
        .filter((rol) => !opciones.some((opcion) => opcion.valor === String(rol.id)))
        .forEach((rol) =>
            opciones.push({ valor: String(rol.id), texto: rol.activo ? rol.nombre : `${rol.nombre} (inactivo)` }),
        )
    const seleccionadas = opciones.filter((opcion) => formulario.rolIds.includes(opcion.valor))

    return (
        <FormModal
            open
            position="right"
            size="sm"
            title={usuario ? 'Editar usuario' : 'Nuevo usuario'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, usuario?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={150} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput label="Correo" errorText={errores.correo}>
                <TextInput type="email" maxLength={150} value={formulario.correo} onChange={cambiar('correo')} />
            </FieldInput>
            <FieldInput
                label="Usuario de red"
                errorText={errores.usuarioRed}
                helperText="Letras, números, punto, guion y guion bajo."
            >
                <TextInput maxLength={60} value={formulario.usuarioRed} onChange={cambiar('usuarioRed')} />
            </FieldInput>
            <FieldInput
                label="Roles"
                errorText={errores.rolIds}
                helperText="Al menos uno. Solo se listan los roles activos."
            >
                <MultiSelect
                    options={opciones}
                    value={seleccionadas}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(lista) =>
                        asignar(
                            'rolIds',
                            lista.map((opcion) => opcion.valor),
                        )
                    }
                />
            </FieldInput>
        </FormModal>
    )
}
