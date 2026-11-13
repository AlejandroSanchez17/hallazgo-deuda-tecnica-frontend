import { EmptyState } from '@hnba/react-ui'
import { useNavigate } from 'react-router-dom'
import { RUTAS } from '../../../utils/constants/rutas'

export const NoEncontradoPage = () => {
    const navegar = useNavigate()

    return (
        <EmptyState
            iconName="search"
            title="Página no encontrada"
            description="La dirección no existe o ya no está disponible."
            actionLabel="Volver al inicio"
            onAction={() => void navegar(RUTAS.inicio)}
        />
    )
}
