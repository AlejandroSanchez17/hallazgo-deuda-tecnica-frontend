import { DatePicker, FieldInput, FormModal, Select, Text, Toggle } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import type { UsuarioFechaFormulario } from '../../types'

interface AsignacionFormProps {
    titulo: string
    etiquetaUsuario: string
    ayudaUsuario: string
    etiquetaFecha: string
    opciones: Opcion[]
    // Con esto se ofrece pasar al nuevo lider los elementos abiertos del anterior; viene marcado
    reasignarElementos?: { etiqueta: string; ayuda: string }
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
    reasignarElementos,
    errores,
    enviando,
    onCerrar,
    onEnviar,
}: AsignacionFormProps) => {
    const { formulario, asignar } = useFormulario<UsuarioFechaFormulario>({
        usuarioId: '',
        fecha: null,
        reasignarElementos: reasignarElementos ? true : undefined,
    })

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={titulo}
            loading={enviando}
            onClose={onCerrar}
            onSubmit={() => onEnviar(formulario)}
        >
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
            {reasignarElementos && (
                <div style={columna(4)}>
                    <Toggle
                        label={reasignarElementos.etiqueta}
                        checked={formulario.reasignarElementos ?? false}
                        onChange={(marcado) => asignar('reasignarElementos', marcado)}
                    />
                    <Text variant="body-regular-small" as="p" style={textoSecundario}>
                        {reasignarElementos.ayuda}
                    </Text>
                </div>
            )}
        </FormModal>
    )
}
