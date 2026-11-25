import { spacing } from '@hnba/design-tokens'
import { Alert, Button } from '@hnba/react-ui'
import { useEsCompacto } from '../../../hooks/useEsCompacto'

interface AvisoConAccionProps {
    variant: 'info' | 'warning' | 'error' | 'success'
    title: string
    description: string
    textoAccion: string
    onAccion: () => void
}

// Espacio que se reserva a la derecha del texto para el boton (el mas largo, "Ir a prórrogas", mide unos 150 px)
const ESPACIO_BOTON = 184

// Un aviso con un boton que lleva a donde se resuelve. Alert y no Banner, para que todos los avisos de la aplicacion se
// vean igual; la libreria solo le da accion al Banner, asi que el boton va como contenido del Alert. Como el Alert
// apila su contenido, en pantallas anchas el boton se saca del flujo y se centra a la derecha, con espacio reservado
// para que no tape el texto; en pantallas estrechas queda debajo del texto
export const AvisoConAccion = ({ variant, title, description, textoAccion, onAccion }: AvisoConAccionProps) => {
    const compacto = useEsCompacto()
    const boton = (
        <Button variant="outlined" size="sm" onClick={onAccion}>
            {textoAccion}
        </Button>
    )

    return (
        <Alert
            variant={variant}
            title={title}
            description={description}
            style={compacto ? undefined : { position: 'relative', paddingRight: ESPACIO_BOTON }}
        >
            {compacto ? (
                <div>{boton}</div>
            ) : (
                <div style={{ position: 'absolute', top: '50%', right: spacing.md, transform: 'translateY(-50%)' }}>
                    {boton}
                </div>
            )}
        </Alert>
    )
}
