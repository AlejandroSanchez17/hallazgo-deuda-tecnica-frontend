import { colors, spacing } from '@hnba/design-tokens'
import { Badge, FieldInput, FormModal, LargeTextArea, Text, TextInput, Toggle } from '@hnba/react-ui'
import { useState } from 'react'
import { columna, fila, textoSecundario } from '../../../../styles/disposicion'
import { useGuardarParametro } from '../../hooks/useGuardarParametro'
import type { ParametroResponse } from '../../types'
import { separarLista } from '../../valores'

interface ParametroFormProps {
    parametro: ParametroResponse
    onCerrar: () => void
    onGuardado: () => void
}

export const ParametroForm = ({ parametro, onCerrar, onGuardado }: ParametroFormProps) => {
    const [valor, setValor] = useState(parametro.valor)
    const { guardar, error, guardando } = useGuardarParametro(onGuardado)

    // La lista se envia limpia: sin espacios ni elementos vacios
    const valorAEnviar = parametro.tipoDato === 'LISTA' ? separarLista(valor).join(',') : valor.trim()

    const control = () => {
        switch (parametro.tipoDato) {
            case 'BOOLEANO':
                return (
                    <Toggle
                        label={valor === 'true' ? 'Activado' : 'Desactivado'}
                        checked={valor === 'true'}
                        onChange={(activo) => setValor(String(activo))}
                    />
                )
            case 'ENTERO':
                return (
                    <FieldInput label="Valor" errorText={error} helperText="Número entero sin signo">
                        <TextInput type="number" min={0} step={1} value={valor} onChange={setValor} />
                    </FieldInput>
                )
            case 'DECIMAL':
                return (
                    <FieldInput
                        label="Valor"
                        errorText={error}
                        helperText="Número sin signo; use punto para los decimales, por ejemplo 2.5"
                    >
                        <TextInput inputMode="decimal" value={valor} onChange={setValor} />
                    </FieldInput>
                )
            case 'LISTA':
                return (
                    <div style={columna(spacing.sm)}>
                        <FieldInput label="Valores" errorText={error} helperText="Separados por coma">
                            <LargeTextArea rows={2} value={valor} onChange={setValor} />
                        </FieldInput>
                        <div style={fila(spacing.xs)}>
                            {separarLista(valor).map((elemento, indice) => (
                                <Badge key={`${elemento}-${indice}`} status="neutral" label={elemento} />
                            ))}
                        </div>
                    </div>
                )
            default:
                return (
                    <FieldInput label="Valor" errorText={error}>
                        <TextInput maxLength={500} value={valor} onChange={setValor} />
                    </FieldInput>
                )
        }
    }

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title="Editar parámetro"
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(parametro.clave, valorAEnviar)}
        >
            <div>
                <Text variant="body-regular-medium" as="p" style={{ margin: 0 }}>
                    {parametro.descripcion}
                </Text>
                <Text variant="body-regular-small" as="p" style={{ ...textoSecundario, fontFamily: 'monospace' }}>
                    {parametro.clave}
                </Text>
            </div>
            {control()}
            {parametro.tipoDato === 'BOOLEANO' && error && (
                <Text variant="body-regular-small" as="p" style={{ margin: 0, color: colors.brand.red[700] }}>
                    {error}
                </Text>
            )}
        </FormModal>
    )
}
