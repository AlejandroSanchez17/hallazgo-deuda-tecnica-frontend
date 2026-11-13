import { spacing } from '@hnba/design-tokens'
import { useState, type CSSProperties } from 'react'
import { useEsCompacto } from '../../../hooks/useEsCompacto'
import { ContenidoPrincipal } from '../ContenidoPrincipal/ContenidoPrincipal'
import { Header } from '../Header/Header'
import { MenuMovil } from '../MenuMovil/MenuMovil'
import { Sidebar } from '../Sidebar/Sidebar'

// La libreria trae 320 px; con las pocas opciones que hay sobra espacio
const ANCHO_SIDEBAR = 256

const estiloPagina: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100svh' }
const estiloCuerpo: CSSProperties = { display: 'flex', flex: 1 }
const estiloContenido: CSSProperties = { flex: 1, minWidth: 0, padding: spacing.lg }

export const LayoutPrincipal = () => {
    const esCompacto = useEsCompacto()
    const [menuAbierto, setMenuAbierto] = useState(false)

    return (
        <div style={estiloPagina}>
            <Header onAbrirMenu={() => setMenuAbierto(true)} />
            <div style={estiloCuerpo}>
                {!esCompacto && <Sidebar ancho={ANCHO_SIDEBAR} />}
                <main style={estiloContenido}>
                    <ContenidoPrincipal />
                </main>
            </div>
            {esCompacto && <MenuMovil abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />}
        </div>
    )
}
