import { spacing } from '@hnba/design-tokens'
import { Badge, Button, Card, List, ListItem, Table, Text, type IconName, type TableRowAction } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { columnasProrrogas } from '../../columnasProrrogas'
import { textoCantidad } from '../../textosProrroga'
import type { ProrrogaResponse, ProrrogasDelElemento } from '../../typesProrroga'

interface ProrrogasElementoProps {
    resumen: ProrrogasDelElemento
    puedePedir: boolean
    puedeResolver: boolean
    onPedir: () => void
    onAprobar: (prorroga: ProrrogaResponse) => void
    onRechazar: (prorroga: ProrrogaResponse) => void
}

const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    columnGap: spacing.lg,
}

const altoFila = { ...fila(spacing.sm), minHeight: 32 }

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={altoFila}>{valor}</div>} />
)

const texto = (valor: string) => <Text variant="body-regular-medium">{valor}</Text>

// Pestana "Prorrogas": el resumen de HU-06, el historial (la mas reciente primero) y las acciones
export const ProrrogasElemento = ({
    resumen,
    puedePedir,
    puedeResolver,
    onPedir,
    onAprobar,
    onRechazar,
}: ProrrogasElementoProps) => {
    const pendiente = (prorroga: ProrrogaResponse) => prorroga.estado === 'PENDIENTE'
    const acciones: TableRowAction<ProrrogaResponse>[] = puedeResolver
        ? [
              {
                  id: 'aprobar',
                  header: 'Aprobar',
                  iconName: 'check_circle',
                  variant: 'ghost',
                  disabled: (prorroga) => !pendiente(prorroga),
                  onClick: onAprobar,
              },
              {
                  id: 'rechazar',
                  header: 'Rechazar',
                  iconName: 'x_circle',
                  variant: 'ghost',
                  disabled: (prorroga) => !pendiente(prorroga),
                  onClick: onRechazar,
              },
          ]
        : []

    return (
        <div style={columna(spacing.md)}>
            <Card padding={16}>
                <div style={rejillaResumen}>
                    <List>
                        {dato(
                            'calendar_alt',
                            'Fecha compromiso original',
                            texto(formatearFecha(resumen.fechaCompromisoOriginal)),
                        )}
                        {dato(
                            'calendar_check',
                            'Fecha compromiso vigente',
                            texto(formatearFecha(resumen.fechaCompromisoVigente)),
                        )}
                    </List>
                    <List>
                        {dato(
                            'calendar_clock',
                            'Prórrogas aprobadas',
                            texto(textoCantidad(resumen.aprobadas, resumen.maximo)),
                        )}
                        {dato(
                            'clock',
                            'Pendiente',
                            resumen.hayPendiente ? <Badge status="warning" label="Sí, por resolver" /> : texto('No'),
                        )}
                    </List>
                </div>
            </Card>

            <div style={filaEntreExtremos}>
                <Text variant="h6" as="h2" style={{ margin: 0 }}>
                    Historial de prórrogas
                </Text>
                {puedePedir && (
                    <Button variant="primary" iconName="calendar_clock" onClick={onPedir}>
                        Pedir prórroga
                    </Button>
                )}
            </div>
            <Table
                columns={columnasProrrogas(resumen.prorrogas)}
                rows={resumen.prorrogas}
                rowActions={acciones}
                getRowLabel={(prorroga) => `Prórroga al ${formatearFecha(prorroga.fechaPropuesta)}`}
                getRowKey={(prorroga) => String(prorroga.id)}
                emptyText="El elemento no tiene prórrogas"
            />
        </div>
    )
}
