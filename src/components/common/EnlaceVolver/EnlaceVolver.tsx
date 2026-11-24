import { Button } from '@hnba/react-ui'

interface EnlaceVolverProps {
    texto: string
    onClick: () => void
}

// Enlace para regresar, encima del titulo (prop volver de Pantalla). Es el boton ghost de la libreria sin su relleno
// (14 x 24 px) ni su alto fijo (46 px): asi queda alineado con el titulo y ocupa poco alto
export const EnlaceVolver = ({ texto, onClick }: EnlaceVolverProps) => (
    <Button variant="ghost" iconName="chevron_left" onClick={onClick} style={{ padding: '4px 0', height: 'auto' }}>
        {texto}
    </Button>
)
