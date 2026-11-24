import { colors, spacing } from '@hnba/design-tokens'
import { Breadcrumb } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { generatePath, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { MIGAS, type Miga } from '../../../utils/constants/migas'
import { useListaDelElemento } from './listaDelElemento'

const estiloFranja: CSSProperties = {
    padding: `${spacing.md}px ${spacing.lg}px`,
    background: colors.global.white,
    borderBottom: `1px solid ${colors.brand.gray[200]}`,
}

// Breadcrumb de la pantalla actual, segun utils/constants/migas.ts; las pantallas sin migas no lo muestran
export const MigasDePan = () => {
    const { pathname } = useLocation()
    const navegar = useNavigate()
    const patron = Object.keys(MIGAS).find((ruta) => matchPath(ruta, pathname))
    const migas = patron ? MIGAS[patron] : undefined
    const listaDelElemento = useListaDelElemento()

    if (!patron || !migas) {
        return null
    }
    const parametros = matchPath(patron, pathname)?.params ?? {}
    const rutaDe = (miga: Miga) =>
        miga.listaDelElemento ? (listaDelElemento ?? undefined) : miga.ruta && generatePath(miga.ruta, parametros)
    return (
        <nav style={estiloFranja} aria-label="Ruta de navegación">
            <Breadcrumb
                lastIsCurrent
                items={migas.map((miga) => {
                    const ruta = rutaDe(miga)
                    return { label: miga.texto, onClick: ruta ? () => void navegar(ruta) : undefined }
                })}
            />
        </nav>
    )
}
