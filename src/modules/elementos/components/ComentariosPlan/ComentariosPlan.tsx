import { spacing } from '@hnba/design-tokens'
import { Text } from '@hnba/react-ui'
import { useMemo } from 'react'
import { columna } from '../../../../styles/disposicion'
import { comentariosApi } from '../../apiComentarios'
import type { PlanResponse } from '../../typesPlan'
import { Comentarios } from '../Comentarios/Comentarios'

interface ComentariosPlanProps {
    // El plan que se esta viendo: cada version tiene sus comentarios
    plan: PlanResponse
}

// Seccion al final de la pagina del plan; una version anterior se ve en solo lectura (422 "Versión anterior")
export const ComentariosPlan = ({ plan }: ComentariosPlanProps) => {
    const fuente = useMemo(() => comentariosApi.delPlan(plan.id), [plan.id])

    return (
        <section style={columna(spacing.sm)}>
            <Text variant="h6" as="h2" style={{ margin: 0 }}>
                Comentarios
            </Text>
            <Comentarios fuente={fuente} soloLectura={!plan.vigente} />
        </section>
    )
}
