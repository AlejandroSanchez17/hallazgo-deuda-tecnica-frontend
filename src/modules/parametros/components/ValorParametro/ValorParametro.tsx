import { spacing } from '@hnba/design-tokens'
import { Badge, Text } from '@hnba/react-ui'
import { fila } from '../../../../styles/disposicion'
import { textoDe } from '../../textos'
import type { ParametroResponse, RolActivo } from '../../types'
import { CLAVE_ROL_VALIDA_CIERRE, separarLista } from '../../valores'

interface ValorParametroProps {
    parametro: ParametroResponse
    // Para mostrar el nombre del rol en lugar de su id
    roles: RolActivo[]
}

export const ValorParametro = ({ parametro, roles }: ValorParametroProps) => {
    if (parametro.clave === CLAVE_ROL_VALIDA_CIERRE) {
        const rol = roles.find((candidato) => String(candidato.id) === parametro.valor)
        return <Text variant="body-bold-medium">{rol?.nombre ?? `Rol ${parametro.valor}`}</Text>
    }
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
