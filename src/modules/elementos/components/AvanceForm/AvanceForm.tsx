import { spacing } from '@hnba/design-tokens'
import { Alert, Button, FieldInput, FormModal, LargeTextArea, Select, Text, TextInput } from '@hnba/react-ui'
import { useState } from 'react'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { OPCIONES_ESTADO_AVANCE, useAvanceForm, type TareaConAvance } from '../../hooks/useAvanceForm'
import { useEvidenciaParaFinalizar } from '../../hooks/useEvidenciaParaFinalizar'
import { ESTADO_TAREA, textoPorcentaje } from '../../textosPlan'
import { EvidenciaForm } from '../EvidenciaForm/EvidenciaForm'

interface AvanceFormProps {
    elementoId: number
    tarea: TareaConAvance
    // Del plan; desde Mis tareas no se conoce y se pide
    requiereEvidencia?: boolean
    // "Depende de X, que no está finalizada…": solo se sabe desde el plan
    avisoDependencia?: string
    onCerrar: () => void
    onRegistrado: () => void
}

const AYUDA_PORCENTAJE: Record<string, string> = {
    PENDIENTE: 'Pendiente es 0 %.',
    EN_PROGRESO: 'De 0 a 99.',
    BLOQUEADA: 'Menos de 100.',
    FINALIZADA: 'Finalizada es 100 %.',
}

// Ventana centrada (tres campos). El estado va primero y fija el porcentaje en Pendiente y Finalizada
export const AvanceForm = ({
    elementoId,
    tarea,
    requiereEvidencia,
    avisoDependencia,
    onCerrar,
    onRegistrado,
}: AvanceFormProps) => {
    const form = useAvanceForm(tarea, onRegistrado)
    const { formulario, errores } = form
    const evidencia = useEvidenciaParaFinalizar(elementoId, tarea, requiereEvidencia)
    const subeEvidencias = usePermiso(PERMISOS.evidenciaCrear)
    const [subiendo, setSubiendo] = useState(false)

    return (
        <>
            <FormModal
                open
                position="center"
                size="sm"
                title={`Avance de ${tarea.titulo}`}
                primaryLabel="Registrar"
                loading={form.guardando}
                onClose={onCerrar}
                onSubmit={form.enviar}
            >
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Hoy: {ESTADO_TAREA[tarea.estado].texto}, {textoPorcentaje(tarea.avance)}
                </Text>
                {avisoDependencia && <Alert variant="info" description={avisoDependencia} />}
                {formulario.estado === 'FINALIZADA' && evidencia.faltaEvidencia && (
                    <Alert variant="warning" title="Para finalizar hace falta una evidencia">
                        <div style={{ ...columna(spacing.sm), alignItems: 'flex-start' }}>
                            <span>El plan exige al menos una evidencia vigente de la tarea.</span>
                            {subeEvidencias && (
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    iconName="upload"
                                    onClick={() => setSubiendo(true)}
                                >
                                    Subir evidencia
                                </Button>
                            )}
                        </div>
                    </Alert>
                )}
                <FieldInput label="Estado" errorText={errores.estado ?? errores.evidencia}>
                    <Select
                        options={OPCIONES_ESTADO_AVANCE}
                        value={opcionDe(OPCIONES_ESTADO_AVANCE, formulario.estado)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        onChange={(opcion) => form.elegirEstado(opcion.valor)}
                    />
                </FieldInput>
                <FieldInput
                    label="Porcentaje"
                    errorText={errores.porcentaje}
                    helperText={AYUDA_PORCENTAJE[formulario.estado]}
                >
                    <TextInput
                        value={formulario.porcentaje}
                        inputMode="decimal"
                        disabled={form.porcentajeFijo}
                        onChange={form.cambiar('porcentaje')}
                    />
                </FieldInput>
                <FieldInput
                    label={form.bloqueada ? 'Motivo del bloqueo' : 'Comentario'}
                    errorText={errores.comentario}
                    helperText={
                        form.bloqueada ? 'Queda como motivo de la tarea bloqueada.' : 'Qué se hizo o qué cambió.'
                    }
                >
                    <LargeTextArea value={formulario.comentario} onChange={form.cambiar('comentario')} />
                </FieldInput>
            </FormModal>
            {subiendo && (
                <EvidenciaForm
                    objetivo={{
                        tipo: 'nueva',
                        destinos: [{ destino: 'TAREA', id: tarea.id, texto: `Tarea: ${tarea.titulo}` }],
                    }}
                    onCerrar={() => setSubiendo(false)}
                    onGuardado={() => {
                        setSubiendo(false)
                        evidencia.revisarDeNuevo()
                    }}
                />
            )}
        </>
    )
}
