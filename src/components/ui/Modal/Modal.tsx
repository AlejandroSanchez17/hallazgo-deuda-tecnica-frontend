import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from 'react'
import { IconoCerrar } from '../Iconos/IconoCerrar'

interface ModalProps {
    abierto: boolean
    titulo: string
    onCerrar: () => void
    children: ReactNode
    acciones?: ReactNode
}

export const Modal = ({ abierto, titulo, onCerrar, children, acciones }: ModalProps) => {
    const refDialogo = useRef<HTMLDialogElement>(null)
    const refCuerpo = useRef<HTMLDivElement>(null)
    const idTitulo = useId()

    useEffect(() => {
        const dialogo = refDialogo.current
        if (!dialogo) {
            return
        }
        if (abierto && !dialogo.open) {
            dialogo.showModal()
            // showModal enfoca la X de cerrar; el foco debe quedar en el primer campo del formulario
            refCuerpo.current?.querySelector<HTMLElement>('input, select, textarea')?.focus()
        }
        if (!abierto && dialogo.open) {
            dialogo.close()
        }
    }, [abierto])

    // Esc lo cierra el padre, para que el estado abierto siga siendo la unica fuente de verdad
    const manejarCancelar = (evento: SyntheticEvent<HTMLDialogElement>) => {
        evento.preventDefault()
        onCerrar()
    }

    return (
        <dialog
            ref={refDialogo}
            aria-labelledby={idTitulo}
            onCancel={manejarCancelar}
            className="m-auto w-full max-w-lg rounded-md bg-blanco text-texto shadow-lg backdrop:bg-texto/40"
        >
            {abierto && (
                <>
                    <header className="flex items-center justify-between border-b border-borde-suave px-5 py-4">
                        <h2 id={idTitulo} className="text-base font-semibold">
                            {titulo}
                        </h2>
                        <button
                            type="button"
                            onClick={onCerrar}
                            aria-label="Cerrar"
                            className="cursor-pointer rounded-md p-1 text-texto-secundario hover:bg-borde-suave focus-visible:outline-2 focus-visible:outline-texto-secundario"
                        >
                            <IconoCerrar />
                        </button>
                    </header>
                    <div ref={refCuerpo} className="px-5 py-4">
                        {children}
                    </div>
                    {acciones && (
                        <footer className="flex justify-end gap-2 border-t border-borde-suave px-5 py-4">
                            {acciones}
                        </footer>
                    )}
                </>
            )}
        </dialog>
    )
}
