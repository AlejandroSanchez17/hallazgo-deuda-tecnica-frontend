import { spacing } from '@hnba/design-tokens'
import { Alert, Table, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { columna } from '../../../../styles/disposicion'
import { criticidadesApi } from '../../api'
import { accionesEditar } from '../../columnas'
import { CriticidadForm } from '../../components/CriticidadForm/CriticidadForm'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import type { CriticidadResponse } from '../../types'

export const CriticidadesPage = () => {
    const [edicion, setEdicion] = useState<CriticidadResponse | null>(null)
    const { registros, cargando, error, recargar } = useListaCatalogo(criticidadesApi.listar, 'todos')
    const { puedeActualizar } = usePermisosCatalogo()
    const criticidades = [...registros].sort((a, b) => a.nivel - b.nivel)

    const columnas: TableColumn<CriticidadResponse>[] = [
        { id: 'nivel', header: 'Nivel', align: 'center', accessor: (criticidad) => criticidad.nivel },
        { id: 'nombre', header: 'Nombre', accessor: (criticidad) => criticidad.nombre },
        { id: 'plazoMeses', header: 'Plazo (meses)', align: 'center', accessor: (criticidad) => criticidad.plazoMeses },
        {
            id: 'maxProrrogas',
            header: 'Prórrogas máximas',
            align: 'center',
            accessor: (criticidad) => criticidad.maxProrrogas,
        },
        {
            id: 'rolApruebaPlan',
            header: 'Aprueba el plan',
            render: (criticidad) => criticidad.rolApruebaPlan.nombre,
        },
        {
            id: 'rolValidaCierre',
            header: 'Valida el cierre',
            render: (criticidad) => criticidad.rolValidaCierre.nombre,
        },
    ]
    const acciones = accionesEditar<CriticidadResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(null)
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo="Criticidades"
                descripcion="El plazo define la fecha compromiso sugerida de cada hallazgo o deuda. Las criticidades no se crean ni se desactivan."
            >
                <div style={columna(spacing.md)}>
                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <Table
                            columns={columnas}
                            rowActions={acciones}
                            getRowLabel={(criticidad) => criticidad.nombre}
                            rows={criticidades}
                            getRowKey={(criticidad) => String(criticidad.id)}
                            loading={cargando}
                        />
                    )}
                </div>
            </Pantalla>

            {edicion && (
                <CriticidadForm criticidad={edicion} onCerrar={() => setEdicion(null)} onGuardado={alGuardar} />
            )}
        </>
    )
}
