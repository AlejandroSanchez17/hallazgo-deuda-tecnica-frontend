import { spacing } from '@hnba/design-tokens'
import { Alert, Button, Table, Text, type TableRowAction } from '@hnba/react-ui'
import { columna, filaEntreExtremos } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { COLUMNAS_CIERRES } from '../../columnasProrrogas'
import type { CierreResponse } from '../../typesProrroga'

interface CierreElementoProps {
    cierres: CierreResponse[]
    // Lo que el backend dijo que falta en el ultimo intento de pedir el cierre (RN-09)
    problemas: string[]
    puedePedir: boolean
    puedeValidar: (cierre: CierreResponse) => boolean
    onPedir: () => void
    onAprobar: (cierre: CierreResponse) => void
    onRechazar: (cierre: CierreResponse) => void
}

const lista = { margin: 0, paddingLeft: spacing.lg }

// Pestana "Cierre": las solicitudes de cierre (la mas reciente primero) y las acciones
export const CierreElemento = ({
    cierres,
    problemas,
    puedePedir,
    puedeValidar,
    onPedir,
    onAprobar,
    onRechazar,
}: CierreElementoProps) => {
    // La columna solo se dibuja si el usuario puede validar la solicitud pendiente
    const acciones: TableRowAction<CierreResponse>[] = cierres.some(puedeValidar)
        ? [
              {
                  id: 'aprobar',
                  header: 'Aprobar',
                  iconName: 'check_circle',
                  variant: 'ghost',
                  disabled: (cierre) => !puedeValidar(cierre),
                  onClick: onAprobar,
              },
              {
                  id: 'rechazar',
                  header: 'Rechazar',
                  iconName: 'x_circle',
                  variant: 'ghost',
                  disabled: (cierre) => !puedeValidar(cierre),
                  onClick: onRechazar,
              },
          ]
        : []

    return (
        <div style={columna(spacing.md)}>
            {problemas.length > 0 && (
                <Alert variant="error" title="Todavía no se puede pedir el cierre">
                    <ul style={lista}>
                        {problemas.map((problema) => (
                            <li key={problema}>{problema}</li>
                        ))}
                    </ul>
                </Alert>
            )}
            <div style={filaEntreExtremos}>
                <Text variant="h6" as="h2" style={{ margin: 0 }}>
                    Solicitudes de cierre
                </Text>
                {puedePedir && (
                    <Button variant="primary" iconName="lock" onClick={onPedir}>
                        Pedir cierre
                    </Button>
                )}
            </div>
            <Table
                columns={COLUMNAS_CIERRES}
                rows={cierres}
                rowActions={acciones}
                getRowLabel={(cierre) => `Solicitud del ${formatearFechaHora(cierre.fechaSolicitud)}`}
                getRowKey={(cierre) => String(cierre.id)}
                emptyText="Todavía no se pidió el cierre"
            />
        </div>
    )
}
