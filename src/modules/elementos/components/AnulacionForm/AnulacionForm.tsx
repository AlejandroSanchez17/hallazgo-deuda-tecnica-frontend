import { Alert, ConfirmDialog, FieldInput, FormModal, LargeTextArea } from '@hnba/react-ui'
import { useAnular } from '../../hooks/useAnular'
import type { ElementoDetalleResponse } from '../../types'

interface AnulacionFormProps {
    ficha: ElementoDetalleResponse
    onCerrar: () => void
    onAnulado: () => void
}

// ConfirmDialog no admite campos (la descripcion va en un parrafo): el motivo se pide aqui y luego se confirma
export const AnulacionForm = ({ ficha, onCerrar, onAnulado }: AnulacionFormProps) => {
    const anulacion = useAnular(ficha, onAnulado)

    return (
        <>
            <FormModal
                open
                position="center"
                size="sm"
                title={`Anular ${ficha.codigo}`}
                primaryLabel="Anular"
                loading={anulacion.guardando}
                onClose={onCerrar}
                onSubmit={anulacion.pedirConfirmacion}
            >
                <Alert
                    variant="warning"
                    description="Un elemento anulado no se puede editar, reasignar ni reactivar. Si una fecha quedó mal, regístrelo de nuevo."
                />
                <FieldInput label="Motivo de la anulación" errorText={anulacion.errorMotivo}>
                    <LargeTextArea value={anulacion.motivo} onChange={anulacion.cambiarMotivo} />
                </FieldInput>
            </FormModal>
            <ConfirmDialog
                open={anulacion.confirmando}
                kind="alert"
                variant="error"
                title={`¿Anular ${ficha.codigo}?`}
                description={`La anulación ${ficha.tipo === 'HALLAZGO' ? 'del hallazgo' : 'de la deuda técnica'} no se deshace.`}
                confirmLabel="Anular"
                cancelLabel="Cancelar"
                onConfirm={anulacion.confirmar}
                onClose={anulacion.cancelarConfirmacion}
            />
        </>
    )
}
