import { FieldInput, LargeTextArea, TextInput } from '@hnba/react-ui'
import { anchoCompleto } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import type { ElementoFormulario } from '../../types'

interface DatosHallazgoProps {
    formulario: ElementoFormulario
    cambiar: (campo: keyof ElementoFormulario) => (valor: string) => void
    errores: ErroresCampo
}

// Celdas de la rejilla del formulario: referencia y ente de a dos; recomendacion y riesgo a lo ancho
export const DatosHallazgo = ({ formulario, cambiar, errores }: DatosHallazgoProps) => (
    <>
        <FieldInput label="Referencia del informe" errorText={errores['hallazgo.referenciaInforme']}>
            <TextInput maxLength={120} value={formulario.referenciaInforme} onChange={cambiar('referenciaInforme')} />
        </FieldInput>
        <FieldInput label="Ente emisor" errorText={errores['hallazgo.enteEmisor']}>
            <TextInput maxLength={150} value={formulario.enteEmisor} onChange={cambiar('enteEmisor')} />
        </FieldInput>
        <div style={anchoCompleto}>
            <FieldInput label="Recomendación" errorText={errores['hallazgo.recomendacion']}>
                <LargeTextArea value={formulario.recomendacion} onChange={cambiar('recomendacion')} />
            </FieldInput>
        </div>
        <div style={anchoCompleto}>
            <FieldInput label="Riesgo asociado" errorText={errores['hallazgo.riesgoAsociado']}>
                <LargeTextArea value={formulario.riesgoAsociado} onChange={cambiar('riesgoAsociado')} />
            </FieldInput>
        </div>
    </>
)
