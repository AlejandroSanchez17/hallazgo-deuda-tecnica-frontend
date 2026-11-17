import { spacing } from '@hnba/design-tokens'
import { Badge, Text } from '@hnba/react-ui'
import { fila } from '../../../../styles/disposicion'
import { textoDe } from '../../textos'
import type { ParametroResponse } from '../../types'
import { separarLista } from '../../valores'

interface ValorParametroProps {
    parametro: ParametroResponse
}

export const ValorParametro = ({ parametro }: ValorParametroProps) => {
    if (parametro.tipoDato === 'BOOLEANO') {
        return (
            <Badge
                status={parametro.valor === 'true' ? 'success' : 'neutral'}
                label={parametro.valor === 'true' ? 'Sí' : 'No'}
            />
        )
    }
    if (parametro.tipoDato === 'LISTA') {
        return (
            <div style={{ ...fila(spacing.xs), maxWidth: 384 }}>
                {separarLista(parametro.valor).map((elemento) => (
                    <Badge key={elemento} status="neutral" label={elemento} />
                ))}
            </div>
        )
    }
    const unidad = textoDe(parametro.clave)?.unidad
    // Con unidad ("120 horas") no se parte en dos lineas
    return unidad ? (
        <Text variant="body-bold-medium" style={{ whiteSpace: 'nowrap' }}>
            {`${parametro.valor} ${unidad}`}
        </Text>
    ) : (
        <Text variant="body-bold-medium">{parametro.valor}</Text>
    )
}
