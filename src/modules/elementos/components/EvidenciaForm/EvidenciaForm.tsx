import { colors, spacing } from '@hnba/design-tokens'
import { Alert, FieldInput, FileUpload, FormModal, LargeTextArea, Radio, Select, Text, TextInput } from '@hnba/react-ui'
import { columna, fila } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { useEvidenciaForm } from '../../hooks/useEvidenciaForm'
import { aceptados, ayudaArchivo, claveDestino, textoDestino } from '../../textosEvidencia'
import type { ObjetivoSubida } from '../../typesEvidencia'

interface EvidenciaFormProps {
    objetivo: ObjetivoSubida
    onCerrar: () => void
    onGuardado: () => void
}

const radioMitad = { flex: 1 }

// El mismo rojo que usa FieldInput en sus errores
const textoError = { color: colors.brand.red[700], margin: 0 }

// Ventana centrada: destino (si hay mas de uno), archivo o enlace, y descripcion
export const EvidenciaForm = ({ objetivo, onCerrar, onGuardado }: EvidenciaFormProps) => {
    const form = useEvidenciaForm(objetivo, onGuardado)
    const { formulario, errores, limites } = form
    const opcionesDestino = form.destinos.map((destino) => ({ valor: claveDestino(destino), texto: destino.texto }))
    const destinoFijo = objetivo.tipo === 'nueva' && form.destinos.length === 1 ? form.destinos[0].texto : null
    const reemplazo = objetivo.tipo === 'reemplazo' ? objetivo.evidencia : null

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={reemplazo ? `Reemplazar la evidencia #${reemplazo.id}` : 'Subir evidencia'}
            primaryLabel={reemplazo ? 'Reemplazar' : 'Subir'}
            loading={form.guardando}
            onClose={onCerrar}
            onSubmit={form.enviar}
        >
            {reemplazo && (
                <Alert
                    variant="info"
                    description={`"${reemplazo.nombre}" queda como reemplazada y se sigue viendo. La nueva queda en ${textoDestino(reemplazo)}.`}
                />
            )}
            {destinoFijo && <Alert variant="info" description={`Se sube en ${destinoFijo}.`} />}
            {errores.estado && <Alert variant="error" description={errores.estado} />}
            {objetivo.tipo === 'nueva' && !destinoFijo && (
                <FieldInput label="Dónde se sube" errorText={errores.destino}>
                    <Select
                        options={opcionesDestino}
                        value={opcionDe(opcionesDestino, formulario.destino)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        placeholder="Elija el elemento, el plan o una tarea"
                        onChange={(opcion) => form.elegirDestino(opcion.valor)}
                    />
                </FieldInput>
            )}
            <div style={fila(spacing.sm)} role="radiogroup" aria-label="Tipo de evidencia">
                <Radio
                    name="tipo-evidencia"
                    title="Archivo"
                    iconName="file_lines"
                    selected={formulario.tipo === 'ARCHIVO'}
                    onClick={() => form.elegirTipo('ARCHIVO')}
                    style={radioMitad}
                />
                <Radio
                    name="tipo-evidencia"
                    title="Enlace"
                    iconName="share"
                    selected={formulario.tipo === 'ENLACE'}
                    onClick={() => form.elegirTipo('ENLACE')}
                    style={radioMitad}
                />
            </div>
            {formulario.tipo === 'ARCHIVO' && (
                // Sin FieldInput: le pasa hasError al FileUpload, que lo deja en el DOM (aviso de React)
                <div style={columna(spacing.xs)}>
                    <Text variant="label-semibold-medium">Archivo</Text>
                    <FileUpload
                        files={form.archivo ? [{ id: 'archivo', file: form.archivo, status: 'pending' }] : []}
                        onFilesAdded={(archivos) => form.elegirArchivo(archivos[0] ?? null)}
                        onRemove={() => form.elegirArchivo(null)}
                        multiple={false}
                        accept={limites ? aceptados(limites.extensiones) : undefined}
                        maxSizeMB={limites?.maximoMb}
                        label="Arrastre el archivo aquí o haga clic para elegirlo"
                        helperText={limites ? ayudaArchivo(limites.extensiones, limites.maximoMb) : undefined}
                    />
                    {errores.archivo && (
                        <Text variant="body-regular-small" as="p" role="alert" style={textoError}>
                            {errores.archivo}
                        </Text>
                    )}
                </div>
            )}
            {formulario.tipo === 'ENLACE' && (
                <>
                    <FieldInput label="URL" errorText={errores.url} helperText="Empieza con http:// o https://">
                        <TextInput
                            value={formulario.url}
                            maxLength={1000}
                            inputMode="url"
                            onChange={form.cambiar('url')}
                        />
                    </FieldInput>
                    <FieldInput
                        label="Nombre"
                        optional
                        errorText={errores.nombre}
                        helperText="Si lo deja vacío, se usa la URL."
                    >
                        <TextInput value={formulario.nombre} maxLength={255} onChange={form.cambiar('nombre')} />
                    </FieldInput>
                </>
            )}
            <FieldInput label="Descripción" errorText={errores.descripcion} helperText="Qué demuestra la evidencia.">
                <LargeTextArea value={formulario.descripcion} maxLength={2000} onChange={form.cambiar('descripcion')} />
            </FieldInput>
        </FormModal>
    )
}
