import { colors } from '@hnba/design-tokens'
import { GraficoLineas } from '../../../../components/common/GraficoLineas/GraficoLineas'
import { textoMes } from '../../textos'
import type { MesTendencia } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface TendenciaMensualProps {
    meses: MesTendencia[]
    // El aplicado ('AAAA-MM-DD'); el backend siempre manda los 12 meses que terminan en el de hasta
    periodo: { desde: string; hasta: string }
}

// Primer mes que cabe entero en el periodo: si empieza a mitad de mes, el siguiente ('2026-05-19' → '2026-06')
const primerMes = (desde: string) => {
    const [anio, mes, dia] = desde.split('-').map(Number)
    if (dia === 1) {
        return desde.slice(0, 7)
    }
    return mes === 12 ? `${anio + 1}-01` : `${anio}-${String(mes + 1).padStart(2, '0')}`
}

// Solo los meses del periodo; si es mas corto que un mes, al menos el ultimo
const delPeriodo = (meses: MesTendencia[], desde: string) => {
    const filtrados = meses.filter((mes) => mes.mes >= primerMes(desde))
    return filtrados.length > 0 ? filtrados : meses.slice(-1)
}

export const TendenciaMensual = ({ meses, periodo }: TendenciaMensualProps) => {
    const visibles = delPeriodo(meses, periodo.desde)
    const nuevos = visibles.reduce((suma, mes) => suma + mes.nuevos, 0)
    const cerrados = visibles.reduce((suma, mes) => suma + mes.cerrados, 0)
    const primero = visibles[0]?.mes ?? ''
    const ultimo = visibles[visibles.length - 1]?.mes ?? ''
    const rango = primero === ultimo ? textoMes(ultimo) : `de ${textoMes(primero)} a ${textoMes(ultimo)}`
    // El periodo pide meses anteriores a los 12 que manda el backend
    const recortado = meses.length > 0 && primerMes(periodo.desde) < meses[0].mes

    return (
        <Bloque
            titulo="Tendencia mensual"
            nota={`Nuevos contra cerrados, ${rango}: ${nuevos} nuevos por fecha de identificación y ${cerrados} cerrados por fecha de cierre. Cada punto cuenta el mes completo; si el período empieza a mitad de mes, arranca en el siguiente.${recortado ? ' Se muestran como máximo los últimos 12 meses.' : ''}`}
        >
            <GraficoLineas
                titulo={`Nuevos y cerrados por mes, ${rango}`}
                etiquetas={visibles.map((mes) => textoMes(mes.mes, true))}
                etiquetasLargas={visibles.map((mes) => textoMes(mes.mes))}
                series={[
                    { nombre: 'Nuevos', color: colors.brand.red[700], valores: visibles.map((mes) => mes.nuevos) },
                    { nombre: 'Cerrados', color: colors.brand.gray[900], valores: visibles.map((mes) => mes.cerrados) },
                ]}
            />
        </Bloque>
    )
}
