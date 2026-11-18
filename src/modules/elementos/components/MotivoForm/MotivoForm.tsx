import { Alert, FieldInput, FormModal, LargeTextArea, type AlertVariant } from '@hnba/react-ui'
import { useState } from 'react'
import { useGuardar } from '../../hooks/useGuardar'

interface MotivoFormProps {
    titulo: string
    etiqueta: string
    boton: string
    // "Cancelar" confunde cuando la accion es cancelar una tarea
    botonCerrar?: string
    // Campo con el que el backend marca el error (motivo, justificacion o comentario)
    campo: string
    aviso?: { variante: AlertVariant; texto: string }
    // Llama a la API con el texto y devuelve el mensaje del backend para el aviso
    enviar: (texto: string) => Promise<string>
    onCerrar: () => void
    onHecho: () => void
}

// Ventana centrada con un solo texto obligatorio: cancelar una tarea, devolver el plan o crear una nueva version
export const MotivoForm = ({
    titulo,
    etiqueta,
    boton,
    botonCerrar,
    campo,
    aviso,
    enviar,
    onCerrar,
    onHecho,
}: MotivoFormProps) => {
    const [texto, setTexto] = useState('')
    const [faltaTexto, setFaltaTexto] = useState(false)
    const { guardar, errores, guardando } = useGuardar(onHecho)

    const alEnviar = () => {
        if (texto.trim() === '') {
            setFaltaTexto(true)
            return
        }
        void guardar(() => enviar(texto.trim()))
    }

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={titulo}
            primaryLabel={boton}
            secondaryLabel={botonCerrar}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={alEnviar}
        >
            {aviso && <Alert variant={aviso.variante} description={aviso.texto} />}
            <FieldInput label={etiqueta} errorText={faltaTexto ? 'Es obligatorio' : errores[campo]}>
                <LargeTextArea
                    value={texto}
                    onChange={(valor) => {
                        setTexto(valor)
                        setFaltaTexto(false)
                    }}
                />
            </FieldInput>
        </FormModal>
    )
}
