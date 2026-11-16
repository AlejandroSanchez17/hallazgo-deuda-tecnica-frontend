import { DatePicker, FieldInput, FormModal, Select } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { rejillaFormulario } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import type { UsuarioFechaFormulario } from '../../types'

interface AsignacionFormProps {
    titulo: string
    etiquetaUsuario: string
    ayudaUsuario: string
    etiquetaFecha: string
    opciones: Opcion[]
    // Mensajes del backend ya puestos en 'usuario' y 'fecha'
    errores: ErroresCampo
    enviando: boolean
    onCerrar: () => void
    onEnviar: (formulario: UsuarioFechaFormulario) => void
}

// Un usuario y una fecha opcional: sirve para cambiar el lider y para agregar un miembro
export const AsignacionForm = ({
    titulo,
    etiquetaUsuario,
    ayudaUsuario,
    etiquetaFecha,
    opciones,
    errores,
    enviando,
    onCerrar,
    onEnviar,
}: AsignacionFormProps) => {
    const { formulario, asignar } = useFormulario<UsuarioFechaFormulario>({ usuarioId: '', fecha: null })

    return (
        <FormModal
            open
            position="right"
            title={titulo}
            loading={enviando}
            onClose={onCerrar}
            onSubmit={() => onEnviar(formulario)}
        >
            <div style={rejillaFormulario}>
                <FieldInput label={etiquetaUsuario} errorText={errores.usuario} helperText={ayudaUsuario}>
                    <Select
                        options={opciones}
                        value={opcionDe(opciones, formulario.usuarioId)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        searchable
                        placeholder="Seleccione…"
                        onChange={(opcion) => asignar('usuarioId', opcion.valor)}
                    />
                </FieldInput>
                <FieldInput
                    label={etiquetaFecha}
                    optional
                    errorText={errores.fecha}
                    helperText="Si no se elige, se usa la fecha de hoy. No puede ser futura."
                >
                    <DatePicker
                        value={formulario.fecha}
                        maxDate={new Date()}
                        placeholder="DD/MM/AAAA"
                        onChange={(fecha) => asignar('fecha', fecha)}
                    />
                </FieldInput>
            </div>
        </FormModal>
    )
}
