import { colors } from '@hnba/design-tokens'
import { GraficoColumnas } from '../../../../components/common/GraficoColumnas/GraficoColumnas'
import { formatearNumero } from '../../textos'
import type { CierrePorCriticidad as Cierre } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface CierrePorCriticidadProps {
    filas: Cierre[]
    // Promedio de todos los cerrados; null si no hay
    promedioGlobal: number | null
}

// Dias promedio de cierre por criticidad, con el promedio general como linea punteada
export const CierrePorCriticidad = ({ filas, promedioGlobal }: CierrePorCriticidadProps) => {
    const ordenadas = [...filas].sort((a, b) => a.nivel - b.nivel)
    return (
        <Bloque
            titulo="Tiempo de cierre por criticidad"
            nota="Días promedio entre la identificación y el cierre, de los cerrados en el período. Sin cerrados, la barra queda en 0."
        >
            <GraficoColumnas
                titulo="Días promedio de cierre por criticidad"
                nombreGrupo="Criticidad"
                ancho={360}
                etiquetas={ordenadas.map((fila) => fila.criticidad)}
                series={[
                    {
                        nombre: 'Días promedio',
                        color: colors.brand.red[700],
                        valores: ordenadas.map((fila) => fila.promedioDias ?? 0),
                    },
                ]}
                referencia={
                    promedioGlobal === null
                        ? undefined
                        : { valor: promedioGlobal, texto: `Promedio: ${formatearNumero(promedioGlobal)} d` }
                }
            />
        </Bloque>
    )
}
