import { spacing } from '@hnba/design-tokens'
import { Avatar, Button, FieldInput, LargeTextArea, List, ListItem, Loader, Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { MAXIMO_COMENTARIO, useComentarios } from '../../hooks/useComentarios'
import type { FuenteComentarios } from '../../typesComentario'

interface ComentariosProps {
    // Estable (useMemo por el id del elemento o del plan)
    fuente: FuenteComentarios
    // Version anterior del plan: se ve la lista, sin el cuadro (422 "Versión anterior")
    soloLectura?: boolean
    // Debajo de la lista (por ejemplo, el enlace a los comentarios del plan)
    pie?: ReactNode
}

// No hay permiso propio: comenta quien puede ver. El cuadro va arriba porque la lista viene del mas reciente
export const Comentarios = ({ fuente, soloLectura = false, pie }: ComentariosProps) => {
    const c = useComentarios(fuente)

    return (
        <div style={columna(spacing.md)}>
            {soloLectura ? (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Los comentarios de una versión anterior son de solo lectura.
                </Text>
            ) : (
                <div style={columna(spacing.sm)}>
                    <FieldInput
                        label="Nuevo comentario"
                        errorText={c.error}
                        helperText={`${c.texto.length} de ${MAXIMO_COMENTARIO} caracteres`}
                    >
                        <LargeTextArea value={c.texto} maxLength={MAXIMO_COMENTARIO} onChange={c.cambiarTexto} />
                    </FieldInput>
                    <div style={{ ...filaEntreExtremos, justifyContent: 'flex-end' }}>
                        <Button
                            variant="primary"
                            iconName="share"
                            disabled={!c.puedeEnviar}
                            loading={c.enviando}
                            onClick={c.enviar}
                        >
                            Comentar
                        </Button>
                    </div>
                </div>
            )}

            {c.cargando && <Loader />}
            {!c.cargando && c.comentarios.length === 0 && (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Todavía no hay comentarios
                </Text>
            )}
            {!c.cargando && c.comentarios.length > 0 && (
                <List dividers>
                    {c.comentarios.map((comentario) => (
                        <ListItem
                            key={comentario.id}
                            leading={<Avatar name={comentario.usuarioNombre} size="sm" />}
                            title={
                                <div style={filaEntreExtremos}>
                                    <Text variant="label-semibold-medium">{comentario.usuarioNombre}</Text>
                                    <small style={textoSecundario}>{formatearFechaHora(comentario.fecha)}</small>
                                </div>
                            }
                            subtitle={<span style={{ whiteSpace: 'pre-line' }}>{comentario.texto}</span>}
                        />
                    ))}
                </List>
            )}
            {pie}
        </div>
    )
}
