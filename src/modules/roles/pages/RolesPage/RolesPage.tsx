import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { recargarUsuariosSimulables } from '../../../../services/api/auth'
import { columna, fila } from '../../../../styles/disposicion'
import { rutaPermisosDeRol } from '../../../../utils/constants/rutas'
import { rolesApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { RolForm } from '../../components/RolForm/RolForm'
import { useBorrar } from '../../hooks/useBorrar'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useLista } from '../../hooks/useLista'
import { usePermisosRoles } from '../../hooks/usePermisosRoles'
import { TEXTOS } from '../../textos'
import type { Edicion, RolResponse } from '../../types'

// El Administrador es el unico rol fijo: no se borra (el backend tambien lo rechaza)
const esAdministrador = (rol: RolResponse) => rol.codigo === 'ADMINISTRADOR'

export const RolesPage = () => {
    const [edicion, setEdicion] = useState<Edicion<RolResponse>>(undefined)
    const navegar = useNavigate()
    const { registros, cargando, error, recargar } = useLista(rolesApi.listar, 'todos')
    // Los nombres de los roles salen en el selector de usuario simulado: se actualiza con cada cambio
    const alCambiar = () => {
        recargar()
        void recargarUsuariosSimulables()
    }
    const { cambiarEstado, dialogo } = useCambiarEstado(rolesApi.cambiarEstado, TEXTOS.rol, alCambiar)
    const { pedirBorrado, dialogo: dialogoBorrar } = useBorrar(rolesApi.borrar, alCambiar)
    const { puedeCrear, puedeActualizar, puedeBorrar } = usePermisosRoles()

    const columnas: TableColumn<RolResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (rol) => <TextoCorto texto={rol.nombre} ancho={220} /> },
        {
            id: 'descripcion',
            header: 'Descripción',
            // Una sola linea con puntos suspensivos; completa, arriba al pasar el cursor
            render: (rol) => <TextoCorto texto={rol.descripcion} ancho={320} />,
        },
        {
            id: 'visibilidadGlobal',
            header: 'Visibilidad global',
            align: 'center',
            render: (rol) => (rol.visibilidadGlobal ? 'Sí' : 'No'),
        },
        { id: 'cantidadPermisos', header: 'Asignados', align: 'center', accessor: (rol) => rol.cantidadPermisos },
        columnaEstado<RolResponse>(TEXTOS.rol),
        ...columnasActivar<RolResponse>(TEXTOS.rol, puedeActualizar ? cambiarEstado : undefined),
    ]
    const accionesBorrar: TableRowAction<RolResponse>[] = puedeBorrar
        ? [
              {
                  id: 'borrar',
                  header: 'Borrar',
                  iconName: 'x_circle',
                  variant: 'ghost',
                  disabled: esAdministrador,
                  onClick: (rol) => pedirBorrado(rol),
              },
          ]
        : []
    const acciones: TableRowAction<RolResponse>[] = [
        {
            id: 'permisos',
            header: 'Permisos',
            iconName: 'key',
            variant: 'ghost',
            onClick: (rol) => void navegar(rutaPermisosDeRol(rol.id)),
        },
        ...accionesEditar<RolResponse>(puedeActualizar ? setEdicion : undefined),
        // La libreria no oculta una accion por fila: en el Administrador queda deshabilitada
        ...accionesBorrar,
    ]

    const alGuardar = (guardado: RolResponse) => {
        const eraNuevo = edicion === null
        setEdicion(undefined)
        alCambiar()
        // Un rol nuevo no tiene permisos: se lleva a su matriz para que los asigne
        if (eraNuevo) {
            void navegar(rutaPermisosDeRol(guardado.id))
        }
    }

    return (
        <>
            <Pantalla titulo="Roles" descripcion="Roles del sistema y sus permisos.">
                <div style={columna(spacing.md)}>
                    {puedeCrear && (
                        <div style={{ ...fila(spacing.md), justifyContent: 'flex-end' }}>
                            <Button variant="primary" iconName="plus" onClick={() => setEdicion(null)}>
                                Nuevo rol
                            </Button>
                        </div>
                    )}

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={columnas}
                            acciones={acciones}
                            filas={registros}
                            claveFila={(rol) => rol.id}
                            etiquetaFila={(rol) => rol.nombre}
                            claveReinicio="roles"
                            cargando={cargando}
                            textoVacio="No hay roles"
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <RolForm rol={edicion ?? undefined} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
            {dialogoBorrar}
        </>
    )
}
