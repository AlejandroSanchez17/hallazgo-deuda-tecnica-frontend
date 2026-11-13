import { EmptyState } from '@hnba/react-ui'
import { useNavigate } from 'react-router-dom'
import { RUTAS } from '../../../utils/constants/rutas'

export const SinPermisoPage = () => {
    const navegar = useNavigate()

    return (
        <EmptyState
            iconName="lock"
            title="Sin permiso"
            description="Su usuario no tiene permiso para ver esta página."
            actionLabel="Volver al inicio"
            onAction={() => void navegar(RUTAS.inicio)}
        />
    )
}
