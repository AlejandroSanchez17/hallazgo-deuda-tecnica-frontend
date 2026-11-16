import { Badge, Card, List, ListItem, Text } from '@hnba/react-ui'
import { nombreLider } from '../../columnas'
import type { EquipoDetalleResponse } from '../../types'

interface ResumenEquipoProps {
    equipo: EquipoDetalleResponse
}

// Datos generales del equipo, sobre las pestanas de miembros
export const ResumenEquipo = ({ equipo }: ResumenEquipoProps) => (
    <Card padding={16}>
        <List dividers>
            <ListItem
                iconName="building"
                title="Área"
                trailing={<Text variant="body-regular-medium">{equipo.areaNombre}</Text>}
            />
            <ListItem
                iconName="user_shield_solid"
                title="Líder"
                trailing={<Text variant="body-regular-medium">{nombreLider(equipo.liderNombre)}</Text>}
            />
            <ListItem
                iconName="people_group"
                title="Miembros vigentes"
                trailing={<Text variant="body-bold-medium">{equipo.miembros.length}</Text>}
            />
            <ListItem
                iconName="check_circle"
                title="Estado"
                trailing={
                    <Badge
                        status={equipo.activo ? 'success' : 'neutral'}
                        label={equipo.activo ? 'Activo' : 'Inactivo'}
                    />
                }
            />
            {equipo.descripcion && (
                <ListItem
                    iconName="file_lines"
                    title="Descripción"
                    trailing={<Text variant="body-regular-medium">{equipo.descripcion}</Text>}
                />
            )}
        </List>
    </Card>
)
