import { spacing } from '@hnba/design-tokens'
import { Button, Text } from '@hnba/react-ui'
import { useMemo } from 'react'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { fila, textoSecundario } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { rutaPlanElemento } from '../../../../utils/constants/rutas'
import { comentariosApi } from '../../apiComentarios'
import { Comentarios } from '../Comentarios/Comentarios'

interface ComentariosElementoProps {
    elementoId: number
}

// Pestana Comentarios del detalle: solo los del elemento; los del plan estan en su pagina
export const ComentariosElemento = ({ elementoId }: ComentariosElementoProps) => {
    const { ir } = useNavegacion()
    const veElPlan = usePermiso(PERMISOS.planLeer)
    const fuente = useMemo(() => comentariosApi.delElemento(elementoId), [elementoId])

    return (
        <Comentarios
            fuente={fuente}
            pie={
                veElPlan && (
                    <div style={fila(spacing.sm)}>
                        <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                            Los comentarios del plan de acción están en su página.
                        </Text>
                        <Button variant="ghost" iconName="square_list" onClick={() => ir(rutaPlanElemento(elementoId))}>
                            Ir al plan
                        </Button>
                    </div>
                )
            }
        />
    )
}
