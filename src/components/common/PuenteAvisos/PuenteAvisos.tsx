import { useToast } from '@hnba/react-ui'
import { useEffect } from 'react'
import { registrarAvisos } from '../../../utils/alertas'

// No dibuja nada: conecta el useToast de la libreria con utils/alertas para poder avisar fuera de React
export const PuenteAvisos = () => {
    const { toast } = useToast()

    useEffect(() => {
        registrarAvisos(toast)
        return () => registrarAvisos(null)
    }, [toast])

    return null
}
