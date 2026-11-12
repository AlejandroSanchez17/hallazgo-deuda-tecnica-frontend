import { Outlet } from 'react-router-dom'
import { Pestanas } from '../../../../components/ui/Pestanas/Pestanas'
import { RUTAS } from '../../../../utils/constants/rutas'

const pestanas = [
    { ruta: RUTAS.catalogosAreas, texto: 'Áreas' },
    { ruta: RUTAS.catalogosOrigenes, texto: 'Orígenes' },
    { ruta: RUTAS.catalogosCategorias, texto: 'Categorías de deuda' },
    { ruta: RUTAS.catalogosAplicaciones, texto: 'Aplicaciones' },
    { ruta: RUTAS.catalogosCriticidades, texto: 'Criticidades' },
]

export const CatalogosPage = () => (
    <section className="max-w-6xl space-y-6">
        <div>
            <h1 className="text-xl font-bold">Catálogos</h1>
            <p className="mt-1 text-sm text-texto-secundario">
                Listas que se usan al registrar hallazgos y deuda técnica.
            </p>
        </div>
        <Pestanas pestanas={pestanas} etiqueta="Catálogos" />
        <Outlet />
    </section>
)
