import { spacing } from '@hnba/design-tokens'
import { Alert, Table, Text, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { criticidadesApi } from '../../api'
import { columnaAcciones } from '../../columnas'
import { CriticidadForm } from '../../components/CriticidadForm/CriticidadForm'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import type { CriticidadResponse, RolResumen } from '../../types'

// Hasta que exista el endpoint de roles (BE-06) se ofrecen los roles que ya usan las criticidades
const rolesUsados = (criticidades: CriticidadResponse[]): RolResumen[] => {
    const porId = new Map<number, RolResumen>()
    criticidades.forEach((criticidad) => {
        porId.set(criticidad.rolApruebaPlan.id, criticidad.rolApruebaPlan)
        porId.set(criticidad.rolValidaCierre.id, criticidad.rolValidaCierre)
    })
    return [...porId.values()]
}

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
    const acciones = columnaAcciones<CriticidadResponse>(puedeActualizar ? setEdicion : undefined)
    if (acciones) {
        columnas.push(acciones)
    }

    const alGuardar = () => {
        setEdicion(null)
        recargar()
    }

    return (
        <div style={columna(spacing.md)}>
            <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                El plazo define la fecha compromiso sugerida de cada hallazgo o deuda. Las criticidades no se crean ni
                se desactivan.
            </Text>

            {error ? (
                <Alert variant="error" description={error.mensaje} />
            ) : (
                <Table
                    columns={columnas}
                    rows={criticidades}
                    getRowKey={(criticidad) => String(criticidad.id)}
                    loading={cargando}
                />
            )}

            {edicion && (
                <CriticidadForm
                    criticidad={edicion}
                    roles={rolesUsados(registros)}
                    onCerrar={() => setEdicion(null)}
                    onGuardado={alGuardar}
                />
            )}
        </div>
    )
}
