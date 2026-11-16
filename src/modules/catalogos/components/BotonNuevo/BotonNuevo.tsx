import { Button } from '@hnba/react-ui'
import { conGenero } from '../../textos'
import type { TextosCatalogo } from '../../types'

interface BotonNuevoProps {
    textos: TextosCatalogo
    onClick: () => void
}

// "Nueva área", "Nuevo origen"…; va en el encabezado de la tarjeta de la pantalla
export const BotonNuevo = ({ textos, onClick }: BotonNuevoProps) => (
    <Button variant="primary" iconName="plus" onClick={onClick}>
        {`${conGenero(textos, 'Nuev')} ${textos.sustantivo}`}
    </Button>
)
