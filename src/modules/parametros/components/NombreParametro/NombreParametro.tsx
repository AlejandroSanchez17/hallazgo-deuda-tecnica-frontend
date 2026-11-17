import { Text } from '@hnba/react-ui'
import { textoSecundario } from '../../../../styles/disposicion'
import { textoDe, type LeerValor } from '../../textos'
import type { ParametroResponse } from '../../types'

interface NombreParametroProps {
    parametro: ParametroResponse
    // Valores con los que se arma la explicacion (en el formulario, con el que se esta escribiendo)
    valor: LeerValor
}

// Con texto propio: nombre y explicacion con los valores. Sin el: la descripcion de la base y la clave, como antes
export const NombreParametro = ({ parametro, valor }: NombreParametroProps) => {
    const texto = textoDe(parametro.clave)
    return (
        <div>
            <Text variant="body-regular-medium" as="p" style={{ margin: 0 }}>
                {texto?.nombre ?? parametro.descripcion}
            </Text>
            <Text
                variant="body-regular-small"
                as="p"
                style={texto ? textoSecundario : { ...textoSecundario, fontFamily: 'monospace' }}
            >
                {texto ? texto.explicacion(valor) : parametro.clave}
            </Text>
        </div>
    )
}
