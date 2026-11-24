import { spacing } from '@hnba/design-tokens'
import { Button, Menu, MenuItem, MenuSeparator, type IconName } from '@hnba/react-ui'
import { fila } from '../../../styles/disposicion'

export interface AccionPantalla {
    texto: string
    icono?: IconName
    onClick: () => void
    // Sin permiso para la accion: no se dibuja
    visible: boolean
    deshabilitada?: boolean
    // Accion de riesgo (anular): va al final del menu, en rojo y separada
    peligrosa?: boolean
}

interface AccionesPantallaProps {
    // El paso siguiente de la pantalla: el unico boton rojo
    principal?: AccionPantalla
    // Se quedan a la vista, al lado de la principal (por ejemplo, Devolver junto a Aprobar)
    directas?: AccionPantalla[]
    // Van en el menu «Mas acciones»; si solo queda una, se muestra como boton
    secundarias?: AccionPantalla[]
}

const esVisible = (accion: AccionPantalla) => accion.visible

const boton = (accion: AccionPantalla, variant: 'primary' | 'outlined') => (
    <Button
        key={accion.texto}
        variant={variant}
        iconName={accion.icono}
        disabled={accion.deshabilitada}
        onClick={accion.onClick}
    >
        {accion.texto}
    </Button>
)

const opcion = (accion: AccionPantalla) => (
    <MenuItem
        key={accion.texto}
        variant={accion.peligrosa ? 'danger' : 'default'}
        iconName={accion.icono}
        disabled={accion.deshabilitada}
        onClick={accion.onClick}
    >
        {accion.texto}
    </MenuItem>
)

// Botones a la derecha del titulo de una pantalla de detalle: una accion principal y el resto en un menu
export const AccionesPantalla = ({ principal, directas = [], secundarias = [] }: AccionesPantallaProps) => {
    const aLaVista = directas.filter(esVisible)
    const enMenu = secundarias.filter(esVisible)
    const normales = enMenu.filter((accion) => !accion.peligrosa)
    const peligrosas = enMenu.filter((accion) => accion.peligrosa)

    if (!principal?.visible && aLaVista.length === 0 && enMenu.length === 0) {
        return null
    }
    return (
        <div style={fila(spacing.sm)}>
            {principal?.visible && boton(principal, 'primary')}
            {aLaVista.map((accion) => boton(accion, 'outlined'))}
            {enMenu.length === 1 && boton(enMenu[0], 'outlined')}
            {enMenu.length > 1 && (
                <Menu
                    placement="bottom-end"
                    trigger={
                        <Button variant="outlined" iconName="chevron_down" iconPosition="right">
                            Más acciones
                        </Button>
                    }
                >
                    {normales.map(opcion)}
                    {normales.length > 0 && peligrosas.length > 0 && <MenuSeparator />}
                    {peligrosas.map(opcion)}
                </Menu>
            )}
        </div>
    )
}
