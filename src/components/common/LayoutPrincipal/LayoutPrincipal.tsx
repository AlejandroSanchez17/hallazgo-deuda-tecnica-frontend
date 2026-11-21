import { spacing } from '@hnba/design-tokens'
import { useState, type CSSProperties } from 'react'
import { useEsCompacto } from '../../../hooks/useEsCompacto'
import { ContenidoPrincipal } from '../ContenidoPrincipal/ContenidoPrincipal'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import { MenuMovil } from '../MenuMovil/MenuMovil'
import { MigasDePan } from '../MigasDePan/MigasDePan'
import { Sidebar } from '../Sidebar/Sidebar'

// La libreria trae 320 px; 304 deja caber "Categorías de deuda" en el tercer nivel (Administración › Catálogos)
const ANCHO_SIDEBAR = 304

const estiloPagina: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100svh' }
const estiloCuerpo: CSSProperties = { display: 'flex', flex: 1 }
// Migas arriba, contenido en medio y Footer siempre al fondo de la ventana
const estiloColumna: CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }
const estiloContenido: CSSProperties = { flex: 1, padding: spacing.lg }

export const LayoutPrincipal = () => {
    const esCompacto = useEsCompacto()
    const [menuAbierto, setMenuAbierto] = useState(false)

    return (
        <div style={estiloPagina}>
            <Header onAbrirMenu={() => setMenuAbierto(true)} />
            <div style={estiloCuerpo}>
                {!esCompacto && <Sidebar ancho={ANCHO_SIDEBAR} colapsable />}
                <div style={estiloColumna}>
                    <MigasDePan />
                    <main style={estiloContenido}>
                        <ContenidoPrincipal />
                    </main>
                    <Footer />
                </div>
            </div>
            {esCompacto && <MenuMovil abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />}
        </div>
    )
}
