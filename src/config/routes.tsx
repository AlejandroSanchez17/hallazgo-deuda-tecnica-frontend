import { Loader } from '@hnba/react-ui'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LayoutPrincipal } from '../components/common/LayoutPrincipal/LayoutPrincipal'
import { RutaProtegida } from '../components/common/RutaProtegida/RutaProtegida'
import { ErrorServidorPage } from '../pages/Error/ErrorServidorPage/ErrorServidorPage'
import { NoEncontradoPage } from '../pages/Error/NoEncontradoPage/NoEncontradoPage'
import { AplicacionesPage } from '../modules/catalogos/pages/AplicacionesPage/AplicacionesPage'
import { AreasPage } from '../modules/catalogos/pages/AreasPage/AreasPage'
import { CatalogosPage } from '../modules/catalogos/pages/CatalogosPage/CatalogosPage'
import { CategoriasPage } from '../modules/catalogos/pages/CategoriasPage/CategoriasPage'
import { CriticidadesPage } from '../modules/catalogos/pages/CriticidadesPage/CriticidadesPage'
import { OrigenesPage } from '../modules/catalogos/pages/OrigenesPage/OrigenesPage'
import { ParametrosPage } from '../modules/parametros/pages/ParametrosPage/ParametrosPage'
import { InicioPage } from '../pages/InicioPage/InicioPage'
import { PERMISOS } from '../utils/constants/permisos'
import { RUTAS } from '../utils/constants/rutas'

export const router = createBrowserRouter([
    {
        path: RUTAS.inicio,
        element: <LayoutPrincipal />,
        errorElement: <ErrorServidorPage />,
        // Se ve si la primera ruta que se abre es diferida
        hydrateFallbackElement: <Loader />,
        children: [
            { index: true, element: <InicioPage /> },
            {
                path: RUTAS.catalogos,
                element: (
                    <RutaProtegida permiso={PERMISOS.catalogoLeer}>
                        <CatalogosPage />
                    </RutaProtegida>
                ),
                children: [
                    { index: true, element: <Navigate to={RUTAS.catalogosAreas} replace /> },
                    { path: RUTAS.catalogosAreas, element: <AreasPage /> },
                    { path: RUTAS.catalogosOrigenes, element: <OrigenesPage /> },
                    { path: RUTAS.catalogosCategorias, element: <CategoriasPage /> },
                    { path: RUTAS.catalogosAplicaciones, element: <AplicacionesPage /> },
                    { path: RUTAS.catalogosCriticidades, element: <CriticidadesPage /> },
                ],
            },
            {
                path: RUTAS.parametros,
                element: (
                    <RutaProtegida permiso={PERMISOS.parametroLeer}>
                        <ParametrosPage />
                    </RutaProtegida>
                ),
            },
            { path: '*', element: <NoEncontradoPage /> },
        ],
    },
])
