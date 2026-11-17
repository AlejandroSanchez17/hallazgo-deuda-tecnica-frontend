import { colors, spacing } from '@hnba/design-tokens'
import { Badge, FieldInput, FormModal, LargeTextArea, Text, TextInput, Toggle } from '@hnba/react-ui'
import { useState } from 'react'
import { columna, fila } from '../../../../styles/disposicion'
import { useGuardarParametro } from '../../hooks/useGuardarParametro'
import { lectorDe, textoDe, type LeerValor } from '../../textos'
import { NombreParametro } from '../NombreParametro/NombreParametro'
import type { ParametroResponse } from '../../types'
import { separarLista } from '../../valores'

interface ParametroFormProps {
    parametro: ParametroResponse
    // Todos los parametros: algunas explicaciones usan el valor de otro (el avance minimo menciona los dias)
    parametros: ParametroResponse[]
    onCerrar: () => void
    onGuardado: () => void
}

export const ParametroForm = ({ parametro, parametros, onCerrar, onGuardado }: ParametroFormProps) => {
    const [valor, setValor] = useState(parametro.valor)
    const { guardar, error, guardando } = useGuardarParametro(onGuardado)

    // La lista se envia limpia: sin espacios ni elementos vacios
    const valorAEnviar = parametro.tipoDato === 'LISTA' ? separarLista(valor).join(',') : valor.trim()
    // La explicacion se arma con lo que se esta escribiendo, para ver el efecto antes de guardar
    const valorGuardado = lectorDe(parametros)
    const valorConEdicion: LeerValor = (clave) =>
        clave === parametro.clave ? valor.trim() || '?' : valorGuardado(clave)
    const unidad = textoDe(parametro.clave)?.unidad
    const etiquetaValor = unidad ? `Valor (${unidad})` : 'Valor'

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
                    <FieldInput label={etiquetaValor} errorText={error} helperText="Número entero sin signo">
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
            <NombreParametro parametro={parametro} valor={valorConEdicion} />
            {control()}
            {parametro.tipoDato === 'BOOLEANO' && error && (
                <Text variant="body-regular-small" as="p" style={{ margin: 0, color: colors.brand.red[700] }}>
                    {error}
                </Text>
            )}
        </FormModal>
    )
}
