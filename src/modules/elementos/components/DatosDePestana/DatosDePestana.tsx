import { Alert, Loader } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import type { ErrorApi } from '../../../../services/api'

interface DatosDePestanaProps {
    cargando: boolean
    error: ErrorApi | null
    children: ReactNode
}

// Cargando, error o el contenido de una pestana que pide sus propios datos
export const DatosDePestana = ({ cargando, error, children }: DatosDePestanaProps) => {
    if (cargando) {
        return <Loader />
    }
    if (error) {
        return <Alert variant="error" description={error.mensaje} />
    }
    return <>{children}</>
}
