import { Avatar, Badge, Card, Divider, List, ListItem, Text } from '@hnba/react-ui'
import { spacing } from '@hnba/design-tokens'
import { useSesionStore } from '../../store/sesionStore'
import { columna, fila, textoSecundario } from '../../styles/disposicion'

export const InicioPage = () => {
    const usuario = useSesionStore((estado) => estado.usuario)

    if (!usuario) {
        return null
    }

    return (
        <section style={{ ...columna(spacing.md), maxWidth: 672 }}>
            <header>
                <Text variant="h3" as="h1" style={{ margin: 0 }}>
                    Bienvenido, {usuario.nombre}
                </Text>
                <Text variant="body-regular-medium" as="p" style={{ ...textoSecundario, marginTop: spacing.xs }}>
                    Use el menú de la izquierda para ir a las opciones de su rol.
                </Text>
            </header>

            <Card padding={24}>
                <div style={fila(spacing.md)}>
                    <Avatar name={usuario.nombre} size="lg" />
                    <div>
                        <Text variant="body-bold-large" as="p" style={{ margin: 0 }}>
                            {usuario.nombre}
                        </Text>
                        <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                            {usuario.correo}
                        </Text>
                    </div>
                </div>

                <Divider style={{ margin: `${spacing.md}px 0` }} />

                <List dividers>
                    <ListItem
                        iconName="user_alt"
                        title="Usuario de red"
                        trailing={<Text variant="body-regular-medium">{usuario.usuarioRed}</Text>}
                    />
                    <ListItem
                        iconName="id_card"
                        title="Roles"
                        trailing={
                            <div style={fila(spacing.sm)}>
                                {usuario.roles.map((rol) => (
                                    <Badge key={rol.id} status="info" label={rol.nombre} />
                                ))}
                            </div>
                        }
                    />
                    <ListItem
                        iconName="eye"
                        title="Visibilidad"
                        trailing={
                            <Badge
                                status={usuario.visibilidadGlobal ? 'success' : 'neutral'}
                                label={usuario.visibilidadGlobal ? 'Global' : 'Solo su equipo'}
                            />
                        }
                    />
                    <ListItem
                        iconName="key"
                        title="Permisos"
                        trailing={<Text variant="body-bold-medium">{usuario.permisos.length}</Text>}
                    />
                </List>
            </Card>
        </section>
    )
}
