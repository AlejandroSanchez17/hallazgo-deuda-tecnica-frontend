import { colors, spacing } from '@hnba/design-tokens'
import { Breadcrumb } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MIGAS } from '../../../utils/constants/migas'

const estiloFranja: CSSProperties = {
    padding: `${spacing.md}px ${spacing.lg}px`,
    background: colors.global.white,
    borderBottom: `1px solid ${colors.brand.gray[200]}`,
}

// Breadcrumb de la pantalla actual, segun utils/constants/migas.ts; las pantallas sin migas no lo muestran
export const MigasDePan = () => {
    const { pathname } = useLocation()
    const navegar = useNavigate()
    const migas = MIGAS[pathname]

    if (!migas) {
        return null
    }
    return (
        <nav style={estiloFranja} aria-label="Ruta de navegación">
            <Breadcrumb
                lastIsCurrent
                items={migas.map((miga) => ({
                    label: miga.texto,
                    onClick: miga.ruta ? () => void navegar(miga.ruta ?? '') : undefined,
                }))}
            />
        </nav>
    )
}
