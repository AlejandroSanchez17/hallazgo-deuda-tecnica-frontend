import { spacing } from '@hnba/design-tokens'
import { AvisoConAccion } from '../../../../components/common/AvisoConAccion/AvisoConAccion'
import { columna } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import type { CierreResponse, ProrrogasDelElemento } from '../../typesProrroga'

interface AvisosElementoProps {
    resumen: ProrrogasDelElemento | null
    cierres: CierreResponse[]
    onVerProrrogas: () => void
    onVerCierre: () => void
}

// Lo que espera una resolucion, sobre las pestanas: la prorroga pendiente y el cierre por validar
export const AvisosElemento = ({ resumen, cierres, onVerProrrogas, onVerCierre }: AvisosElementoProps) => {
    const prorroga = resumen?.prorrogas.find((p) => p.estado === 'PENDIENTE')
    const cierre = cierres.find((c) => c.resultado === 'PENDIENTE')
    if (!prorroga && !cierre) {
        return null
    }

    return (
        <div style={columna(spacing.sm)}>
            {prorroga && (
                <AvisoConAccion
                    variant="info"
                    title={prorroga.esAdicional ? 'Prórroga adicional pendiente' : 'Prórroga pendiente'}
                    description={`${prorroga.solicitanteNombre} propone pasar la fecha compromiso del ${formatearFecha(prorroga.fechaAnterior)} al ${formatearFecha(prorroga.fechaPropuesta)}. La resuelve quien puede aprobar prórrogas.`}
                    textoAccion="Ver prórroga"
                    onAccion={onVerProrrogas}
                />
            )}
            {cierre && (
                <AvisoConAccion
                    variant="info"
                    title="Cierre solicitado"
                    description={`${cierre.solicitanteNombre} pidió el cierre; lo valida el rol ${cierre.rolRequeridoNombre}.`}
                    textoAccion="Ver cierre"
                    onAccion={onVerCierre}
                />
            )}
        </div>
    )
}
