import { spacing } from '@hnba/design-tokens'
import { Alert, Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { recargarUsuariosSimulables } from '../../../../services/api/auth'
import { columna } from '../../../../styles/disposicion'
import { rutaPermisosDeRol } from '../../../../utils/constants/rutas'
import { rolesApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { RolForm } from '../../components/RolForm/RolForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useLista } from '../../hooks/useLista'
import { usePermisosRoles } from '../../hooks/usePermisosRoles'
import { TEXTOS } from '../../textos'
import type { RolResponse } from '../../types'

// Dos lineas como maximo con puntos suspensivos; el texto completo sale en el tooltip
const estiloDescripcion: CSSProperties = {
    maxWidth: 120,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
}

export const RolesPage = () => {
    const [edicion, setEdicion] = useState<RolResponse | null>(null)
    const navegar = useNavigate()
    const { registros, cargando, error, recargar } = useLista(rolesApi.listar, 'todos')
    // Los nombres de los roles salen en el selector de usuario simulado: se actualiza con cada cambio
    const alCambiar = () => {
        recargar()
        void recargarUsuariosSimulables()
    }
    const { cambiarEstado, dialogo } = useCambiarEstado(rolesApi.cambiarEstado, TEXTOS.rol, alCambiar)
    const { puedeActualizar } = usePermisosRoles()

    const columnas: TableColumn<RolResponse>[] = [
        { id: 'nombre', header: 'Nombre', accessor: (rol) => rol.nombre },
        {
            id: 'descripcion',
            header: 'Descripción',
            // Se recorta con puntos suspensivos para que alcancen las columnas de la derecha; completa, en el tooltip
            render: (rol) => (
                <div style={estiloDescripcion} title={rol.descripcion ?? undefined}>
                    {rol.descripcion ?? '—'}
                </div>
            ),
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
    const acciones: TableRowAction<RolResponse>[] = [
        {
            id: 'permisos',
            header: 'Permisos',
            iconName: 'key',
            variant: 'ghost',
            onClick: (rol) => void navegar(rutaPermisosDeRol(rol.id)),
        },
        ...accionesEditar<RolResponse>(puedeActualizar ? setEdicion : undefined),
    ]

    const alGuardar = () => {
        setEdicion(null)
        alCambiar()
    }

    return (
        <>
            <Pantalla
                titulo="Roles"
                descripcion="Los roles no se crean ni se eliminan: se editan, se activan o desactivan y se les asignan permisos."
            >
                <div style={columna(spacing.md)}>
                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <Table
                            columns={columnas}
                            rowActions={acciones}
                            getRowLabel={(rol) => rol.nombre}
                            rows={registros}
                            getRowKey={(rol) => String(rol.id)}
                            loading={cargando}
                        />
                    )}
                </div>
            </Pantalla>

            {edicion && <RolForm rol={edicion} onCerrar={() => setEdicion(null)} onGuardado={alGuardar} />}
            {dialogo}
        </>
    )
}
