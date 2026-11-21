import { colors } from '@hnba/design-tokens'
import { GraficoColumnas } from '../../../../components/common/GraficoColumnas/GraficoColumnas'
import { ENCABEZADO_TIPO } from '../../textos'
import type { AbiertosCriticidad, TipoElemento } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface AbiertosPorCriticidadProps {
    filas: AbiertosCriticidad[]
}

const COLOR_TIPO: Record<TipoElemento, string> = {
    HALLAZGO: colors.brand.red[700],
    DEUDA: colors.brand.gray[900],
}

// Columnas agrupadas: por cada criticidad, una columna de hallazgos y otra de deuda (el backend manda una fila por tipo y criticidad)
export const AbiertosPorCriticidad = ({ filas }: AbiertosPorCriticidadProps) => {
    const criticidades = new Map<number, { criticidad: string; nivel: number }>()
    filas.forEach(({ criticidadId, criticidad, nivel }) => criticidades.set(criticidadId, { criticidad, nivel }))
    const ordenadas = [...criticidades.entries()].sort(([, a], [, b]) => a.nivel - b.nivel)
    const tipos = (['HALLAZGO', 'DEUDA'] as TipoElemento[]).filter((tipo) => filas.some((fila) => fila.tipo === tipo))

    const abiertos = (tipo: TipoElemento, criticidadId: number) =>
        filas.find((fila) => fila.tipo === tipo && fila.criticidadId === criticidadId)?.abiertos ?? 0

    return (
        <Bloque titulo="Abiertos por tipo y criticidad" nota="Elementos sin cerrar ni anular, hoy.">
            {ordenadas.length === 0 ? null : (
                <GraficoColumnas
                    titulo="Abiertos por tipo y criticidad"
                    nombreGrupo="Criticidad"
                    etiquetas={ordenadas.map(([, { criticidad }]) => criticidad)}
                    series={tipos.map((tipo) => ({
                        nombre: ENCABEZADO_TIPO[tipo],
                        color: COLOR_TIPO[tipo],
                        valores: ordenadas.map(([criticidadId]) => abiertos(tipo, criticidadId)),
                    }))}
                />
            )}
        </Bloque>
    )
}
