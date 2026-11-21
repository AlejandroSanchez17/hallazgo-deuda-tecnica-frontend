import { spacing } from '@hnba/design-tokens'
import { Badge, Table, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { fila } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import type { MiembroResponse } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

interface TablaMiembrosProps {
    miembros: MiembroResponse[]
    // En el historial se ve la fecha de salida y no se retira a nadie
    historial: boolean
    textoVacio: string
    onRetirar?: (miembro: MiembroResponse) => void
}

export const TablaMiembros = ({ miembros, historial, textoVacio, onRetirar }: TablaMiembrosProps) => {
    const columnas: TableColumn<MiembroResponse>[] = [
        {
            id: 'nombre',
            header: 'Nombre',
            render: (miembro) =>
                miembro.usuarioActivo ? (
                    <TextoCorto texto={miembro.usuarioNombre} ancho={220} />
                ) : (
                    <div style={fila(spacing.sm)}>
                        {miembro.usuarioNombre}
                        <Badge status="neutral" label="Inactivo" />
                    </div>
                ),
        },
        {
            id: 'usuarioRed',
            header: 'Usuario de red',
            render: (miembro) => <TextoCorto texto={miembro.usuarioRed} ancho={180} />,
        },
        {
            id: 'papel',
            header: 'Papel',
            align: 'center',
            render: (miembro) =>
                miembro.esLider ? <Badge status="info" label="Líder" /> : <Badge status="neutral" label="Miembro" />,
        },
        {
            id: 'ingreso',
            header: 'Ingreso',
            align: 'center',
            render: (miembro) => formatearFecha(miembro.fechaIngreso),
        },
        ...(historial
            ? [
                  {
                      id: 'salida',
                      header: 'Salida',
                      align: 'center',
                      render: (miembro) =>
                          miembro.fechaSalida ? (
                              formatearFecha(miembro.fechaSalida)
                          ) : (
                              <Badge status="success" label="Vigente" />
                          ),
                  } satisfies TableColumn<MiembroResponse>,
              ]
            : []),
    ]
    // Al lider no se le retira: primero se cambia
    const acciones: TableRowAction<MiembroResponse>[] = onRetirar
        ? [
              {
                  id: 'retirar',
                  header: 'Retirar',
                  iconName: 'user_alt_slash',
                  variant: 'ghost',
                  disabled: (miembro) => miembro.esLider,
                  onClick: onRetirar,
              },
          ]
        : []

    return (
        <Table
            columns={columnas}
            rowActions={acciones}
            getRowLabel={(miembro) => miembro.usuarioNombre}
            rows={miembros}
            // En el historial un usuario puede aparecer varias veces (salio y volvio a entrar)
            getRowKey={(miembro) => String(miembro.id)}
            emptyText={textoVacio}
        />
    )
}
