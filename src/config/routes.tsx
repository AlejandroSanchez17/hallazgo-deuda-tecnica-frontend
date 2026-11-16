import { Loader } from '@hnba/react-ui'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { LayoutPrincipal } from '../components/common/LayoutPrincipal/LayoutPrincipal'
import { RutaProtegida } from '../components/common/RutaProtegida/RutaProtegida'
import { ErrorServidorPage } from '../pages/Error/ErrorServidorPage/ErrorServidorPage'
import { NoEncontradoPage } from '../pages/Error/NoEncontradoPage/NoEncontradoPage'
import { AplicacionesPage } from '../modules/catalogos/pages/AplicacionesPage/AplicacionesPage'
import { AreasPage } from '../modules/catalogos/pages/AreasPage/AreasPage'
import { CategoriasPage } from '../modules/catalogos/pages/CategoriasPage/CategoriasPage'
import { CriticidadesPage } from '../modules/catalogos/pages/CriticidadesPage/CriticidadesPage'
import { EquipoDetallePage } from '../modules/equipos/pages/EquipoDetallePage/EquipoDetallePage'
import { EquiposPage } from '../modules/equipos/pages/EquiposPage/EquiposPage'
import { OrigenesPage } from '../modules/catalogos/pages/OrigenesPage/OrigenesPage'
import { ParametrosPage } from '../modules/parametros/pages/ParametrosPage/ParametrosPage'
import { PermisosPage } from '../modules/roles/pages/PermisosPage/PermisosPage'
import { RolesPage } from '../modules/roles/pages/RolesPage/RolesPage'
import { UsuariosPage } from '../modules/usuarios/pages/UsuariosPage/UsuariosPage'
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
                // Cada catalogo es su propia pantalla; la ruta del grupo solo redirige a la primera (la usa el breadcrumb)
                path: RUTAS.catalogos,
                element: (
                    <RutaProtegida permiso={PERMISOS.catalogoLeer}>
                        <Outlet />
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
                path: RUTAS.usuarios,
                element: (
                    <RutaProtegida permiso={PERMISOS.usuarioLeer}>
                        <UsuariosPage />
                    </RutaProtegida>
                ),
            },
            {
                path: RUTAS.roles,
                element: (
                    <RutaProtegida permiso={PERMISOS.usuarioLeer}>
                        <Outlet />
                    </RutaProtegida>
                ),
                children: [
                    { index: true, element: <Navigate to={RUTAS.rolesListado} replace /> },
                    { path: RUTAS.rolesListado, element: <RolesPage /> },
                    { path: RUTAS.rolesPermisos, element: <PermisosPage /> },
                ],
            },
            {
                path: RUTAS.equipos,
                element: (
                    <RutaProtegida permiso={PERMISOS.equipoLeer}>
                        <Outlet />
                    </RutaProtegida>
                ),
                children: [
                    { index: true, element: <EquiposPage /> },
                    { path: RUTAS.equipoDetalle, element: <EquipoDetallePage /> },
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
