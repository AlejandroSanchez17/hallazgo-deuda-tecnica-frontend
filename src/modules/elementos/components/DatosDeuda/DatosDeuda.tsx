import { spacing } from '@hnba/design-tokens'
import { FieldInput, LargeTextArea, Select, Text, TextInput } from '@hnba/react-ui'
import { anchoCompleto, columna, textoSecundario } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { useHorasPorTalla } from '../../hooks/useCombos'
import { TALLAS, textoTalla } from '../../textos'
import type { ElementoFormulario, Talla } from '../../types'

interface DatosDeudaProps {
    formulario: ElementoFormulario
    cambiar: (campo: keyof ElementoFormulario) => (valor: string) => void
    asignar: <K extends keyof ElementoFormulario>(campo: K, valor: ElementoFormulario[K]) => void
    errores: ErroresCampo
    categorias: Opcion[]
}

// Celdas de la rejilla del formulario: categoria y componente, horas y talla, y los tres textos a lo ancho
export const DatosDeuda = ({ formulario, cambiar, asignar, errores, categorias }: DatosDeudaProps) => {
    const horasPorTalla = useHorasPorTalla()
    const opcionesTalla: Opcion[] = [
        { valor: '', texto: 'Sin talla' },
        ...TALLAS.map((talla) => ({ valor: talla, texto: textoTalla(talla, horasPorTalla[talla]) })),
    ]

    return (
        <>
            <FieldInput label="Categoría" errorText={errores['deuda.categoriaDeudaId']}>
                <Select
                    options={categorias}
                    value={opcionDe(categorias, formulario.categoriaDeudaId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => asignar('categoriaDeudaId', opcion.valor)}
                />
            </FieldInput>
            <FieldInput label="Componente" errorText={errores['deuda.componente']}>
                <TextInput maxLength={150} value={formulario.componente} onChange={cambiar('componente')} />
            </FieldInput>
            {/* Cada campo es opcional, pero el esfuerzo no: hace falta al menos uno de los dos */}
            <div style={{ ...anchoCompleto, ...columna(spacing.xs) }}>
                <Text variant="label-bold-medium">Esfuerzo estimado (Requerido) *</Text>
                <small style={textoSecundario}>
                    Indique las horas, la talla o ambas. Si indica las dos, cuentan las horas.
                </small>
            </div>
            <FieldInput
                label="Esfuerzo en horas"
                optional
                errorText={errores['deuda.esfuerzoHoras']}
                helperText="Mayor que 0, hasta 2 decimales."
            >
                <TextInput inputMode="decimal" value={formulario.esfuerzoHoras} onChange={cambiar('esfuerzoHoras')} />
            </FieldInput>
            <FieldInput
                label="Talla"
                optional
                errorText={errores['deuda.talla']}
                helperText="Si no indica horas, se usan las de la talla."
            >
                <Select
                    options={opcionesTalla}
                    value={opcionDe(opcionesTalla, formulario.talla)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    onChange={(opcion) => asignar('talla', opcion.valor as Talla | '')}
                />
            </FieldInput>
            <div style={anchoCompleto}>
                <FieldInput label="Causa" errorText={errores['deuda.causa']}>
                    <LargeTextArea value={formulario.causa} onChange={cambiar('causa')} />
                </FieldInput>
            </div>
            <div style={anchoCompleto}>
                <FieldInput label="Impacto técnico" errorText={errores['deuda.impactoTecnico']}>
                    <LargeTextArea value={formulario.impactoTecnico} onChange={cambiar('impactoTecnico')} />
                </FieldInput>
            </div>
            <div style={anchoCompleto}>
                <FieldInput label="Impacto en el negocio" errorText={errores['deuda.impactoNegocio']}>
                    <LargeTextArea value={formulario.impactoNegocio} onChange={cambiar('impactoNegocio')} />
                </FieldInput>
            </div>
        </>
    )
}
