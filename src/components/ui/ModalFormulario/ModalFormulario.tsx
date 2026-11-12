import { useId, type FormEvent, type ReactNode } from 'react'
import { Boton } from '../Boton/Boton'
import { Modal } from '../Modal/Modal'

interface ModalFormularioProps {
    titulo: string
    guardando: boolean
    onCerrar: () => void
    onEnviar: () => void
    children: ReactNode
}

export const ModalFormulario = ({ titulo, guardando, onCerrar, onEnviar, children }: ModalFormularioProps) => {
    const idFormulario = useId()

    const enviar = (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault()
        onEnviar()
    }

    return (
        <Modal
            abierto
            titulo={titulo}
            onCerrar={onCerrar}
            acciones={
                <>
                    <Boton onClick={onCerrar}>Cancelar</Boton>
                    <Boton variante="primario" type="submit" form={idFormulario} disabled={guardando}>
                        {guardando ? 'Guardando…' : 'Guardar'}
                    </Boton>
                </>
            }
        >
            {/* noValidate: las validaciones las hace el backend y se muestran debajo de cada campo */}
            <form id={idFormulario} onSubmit={enviar} noValidate className="space-y-4">
                {children}
            </form>
        </Modal>
    )
}
