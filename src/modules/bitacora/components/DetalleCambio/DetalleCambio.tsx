import { spacing } from '@hnba/design-tokens'
import { Badge, Modal, Table, Text, type TableColumn } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { ESTADO_ACCION, legible, TEXTO_ACCION, TEXTOS, textoEntidad } from '../../textos'
import type { RegistroBitacora, ValorBitacora } from '../../types'

interface DetalleCambioProps {
    registro: RegistroBitacora
    onCerrar: () => void
}

interface FilaCambio {
    campo: string
    antes: unknown
    despues: unknown
}

const mostrar = (valor: unknown): string => {
    if (valor === null || valor === undefined || valor === '') {
        return TEXTOS.porDefecto
    }
    if (typeof valor === 'boolean') {
        return valor ? 'Sí' : 'No'
    }
    if (typeof valor === 'object') {
        return JSON.stringify(valor)
    }
    return String(valor)
}

const cambioDe = (antes: ValorBitacora, despues: ValorBitacora): FilaCambio[] => {
    const campos = [...new Set([...Object.keys(antes ?? {}), ...Object.keys(despues ?? {})])]
    return campos.map((campo) => ({ campo, antes: antes?.[campo], despues: despues?.[campo] }))
}

// Lo que no cambio (ni se guardo de un lado) se ve igual en las dos columnas; lo que cambio, en negrita
const cambio = (fila: FilaCambio) => mostrar(fila.antes) !== mostrar(fila.despues)

const columnas: TableColumn<FilaCambio>[] = [
    { id: 'campo', header: 'Campo', render: (fila) => legible(fila.campo) },
    { id: 'antes', header: 'Antes', render: (fila) => mostrar(fila.antes) },
    {
        id: 'despues',
        header: 'Después',
        render: (fila) => (cambio(fila) ? <strong>{mostrar(fila.despues)}</strong> : mostrar(fila.despues)),
    },
]

const dato = (etiqueta: string, valor: React.ReactNode) => (
    <div key={etiqueta} style={columna(2)}>
        <small style={textoSecundario}>{etiqueta}</small>
        <span>{valor}</span>
    </div>
)

// Panel por la derecha con quien, cuando y desde donde, y la diferencia entre el valor anterior y el nuevo
export const DetalleCambio = ({ registro, onCerrar }: DetalleCambioProps) => {
    const filas = cambioDe(registro.valorAnterior, registro.valorNuevo)

    return (
        <Modal
            open
            position="right"
            title="Detalle del cambio"
            subtitle={`${textoEntidad(registro.entidad)} · cambio ${registro.id}`}
            onClose={onCerrar}
        >
            <div style={columna(spacing.lg)}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                        gap: spacing.md,
                    }}
                >
                    {dato('Fecha', formatearFechaHora(registro.fecha))}
                    {dato('Usuario', registro.usuarioNombre ?? TEXTOS.porDefecto)}
                    {dato(
                        'Acción',
                        <Badge status={ESTADO_ACCION[registro.accion]} label={TEXTO_ACCION[registro.accion]} />,
                    )}
                    {dato('Entidad', textoEntidad(registro.entidad))}
                    {dato('Id del registro', registro.entidadId === 0 ? TEXTOS.porDefecto : registro.entidadId)}
                    {dato('IP', registro.ip ?? TEXTOS.porDefecto)}
                </div>

                <div style={columna(spacing.sm)}>
                    <Text variant="h6" as="h2" style={{ margin: 0 }}>
                        Antes y después
                    </Text>
                    <Table
                        columns={columnas}
                        rows={filas}
                        getRowKey={(fila) => fila.campo}
                        emptyText={TEXTOS.sinCambios}
                    />
                </div>
            </div>
        </Modal>
    )
}
