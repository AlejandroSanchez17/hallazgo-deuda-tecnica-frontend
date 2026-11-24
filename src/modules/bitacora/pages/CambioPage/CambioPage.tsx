import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, Card, Table, Text, Toggle, type TableColumn } from '@hnba/react-ui'
import { useState, type ReactNode } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { EnlaceVolver } from '../../../../components/common/EnlaceVolver/EnlaceVolver'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { RUTAS } from '../../../../utils/constants/rutas'
import { formatearFechaHora } from '../../../../utils/formato'
import { cambiosDe, TIPO_CAMBIO, type FilaCambio } from '../../cambios'
import { ESTADO_ACCION, TEXTO_ACCION, TEXTOS, textoEntidad } from '../../textos'
import type { RegistroBitacora } from '../../types'

const columnas: TableColumn<FilaCambio>[] = [
    { id: 'campo', header: 'Campo', render: (cambio) => cambio.campo },
    { id: 'antes', header: 'Antes', render: (cambio) => cambio.antes },
    {
        id: 'despues',
        header: 'Después',
        render: (cambio) => (cambio.tipo === 'IGUAL' ? cambio.despues : <strong>{cambio.despues}</strong>),
    },
    {
        id: 'cambio',
        header: 'Cambio',
        align: 'center',
        render: ({ tipo }) => <Badge status={TIPO_CAMBIO[tipo].estado} label={TIPO_CAMBIO[tipo].texto} />,
    },
]

// Tres datos por fila (cada columna mide al menos un tercio); en pantallas angostas bajan a dos o a una
const rejilla = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(max(min(100%, 180px), (100% - ${2 * spacing.md}px) / 3), 1fr))`,
    gap: spacing.md,
}

const dato = (etiqueta: string, valor: ReactNode) => (
    <div key={etiqueta} style={columna(2)}>
        <small style={{ ...textoSecundario, fontWeight: 700 }}>{etiqueta}</small>
        <span>{valor}</span>
    </div>
)

// Pantalla con quien, cuando y desde donde, y la diferencia entre el valor anterior y el nuevo. El backend no tiene un
// servicio para pedir un solo registro: llega de la lista en el estado de la navegacion (se conserva al recargar)
export const CambioPage = () => {
    const id = Number(useParams().id)
    const { state } = useLocation()
    const { volver } = useNavegacion()
    const [conIguales, setConIguales] = useState(false)
    const recibido = (state as { registro?: RegistroBitacora } | null)?.registro
    const registro = recibido?.id === id ? recibido : undefined

    const enlace = <EnlaceVolver texto="Volver a la bitácora" onClick={() => volver(RUTAS.bitacora)} />

    if (!registro) {
        return (
            <Pantalla titulo="Detalle del cambio" descripcion={TEXTOS.descripcionCambio} volver={enlace}>
                <Alert variant="info" description="Abra el cambio desde la lista de la bitácora." />
            </Pantalla>
        )
    }

    const cambios = cambiosDe(registro.valorAnterior, registro.valorNuevo)
    const iguales = cambios.filter((cambio) => cambio.tipo === 'IGUAL').length
    const visibles = conIguales ? cambios : cambios.filter((cambio) => cambio.tipo !== 'IGUAL')

    return (
        <Pantalla
            titulo={`${textoEntidad(registro.entidad)} - Cambio ${registro.id}`}
            descripcion={TEXTOS.descripcionCambio}
            volver={enlace}
        >
            <div style={columna(spacing.md)}>
                <Card padding={16}>
                    <div style={rejilla}>
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
                </Card>

                <div style={{ ...filaEntreExtremos, alignItems: 'center' }}>
                    <Text variant="h6" as="h2" style={{ margin: 0 }}>
                        Antes y después
                    </Text>
                    {iguales > 0 && (
                        <Toggle
                            checked={conIguales}
                            onChange={setConIguales}
                            label={`Mostrar lo que no cambió (${iguales})`}
                        />
                    )}
                </div>
                <Table
                    columns={columnas}
                    rows={visibles}
                    getRowKey={(cambio) => cambio.clave}
                    emptyText={cambios.length === 0 ? TEXTOS.sinCambios : TEXTOS.soloIguales}
                />
            </div>
        </Pantalla>
    )
}
