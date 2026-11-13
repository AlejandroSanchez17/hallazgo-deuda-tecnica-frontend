import { Button, EmptyState } from '@hnba/react-ui'
import type { CSSProperties } from 'react'

// Recarga completa porque el estado de la aplicacion pudo quedar inconsistente
const recargarInicio = () => window.location.assign('/')

const estiloPagina: CSSProperties = { minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24 }

export const ErrorServidorPage = () => (
    <main style={estiloPagina}>
        <EmptyState
            iconName="x_circle"
            title="Algo salió mal"
            description="Ocurrió un problema al mostrar esta página. Intente de nuevo."
        />
        <Button variant="primary" onClick={recargarInicio}>
            Volver al inicio
        </Button>
    </main>
)
