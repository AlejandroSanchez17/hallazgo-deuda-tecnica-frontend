import { Tabs, Text } from '@hnba/react-ui'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { columna, paginaAncha, textoSecundario } from '../../../../styles/disposicion'
import { RUTAS } from '../../../../utils/constants/rutas'

// El id de cada pestaña es su ruta
const pestanas = [
    { id: RUTAS.catalogosAreas, label: 'Áreas' },
    { id: RUTAS.catalogosOrigenes, label: 'Orígenes' },
    { id: RUTAS.catalogosCategorias, label: 'Categorías de deuda' },
    { id: RUTAS.catalogosAplicaciones, label: 'Aplicaciones' },
    { id: RUTAS.catalogosCriticidades, label: 'Criticidades' },
]

export const CatalogosPage = () => {
    const { pathname } = useLocation()
    const navegar = useNavigate()

    return (
        <section style={paginaAncha}>
            <div style={columna(4)}>
                <Text variant="h3" as="h1" style={{ margin: 0 }}>
                    Catálogos
                </Text>
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Listas que se usan al registrar hallazgos y deuda técnica.
                </Text>
            </div>
            <Tabs tabs={pestanas} value={pathname} onChange={(ruta) => void navegar(ruta)} />
            <Outlet />
        </section>
    )
}
