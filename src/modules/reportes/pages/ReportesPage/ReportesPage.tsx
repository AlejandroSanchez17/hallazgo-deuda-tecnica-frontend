import { spacing } from '@hnba/design-tokens'
import { Alert, EmptyState, FieldInput, Select, Text } from '@hnba/react-ui'
import { useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { BotonesDeDescarga } from '../../components/BotonesDeDescarga/BotonesDeDescarga'
import { FiltrosDelReporte } from '../../components/FiltrosDelReporte/FiltrosDelReporte'
import { alElegirReporte, aConsulta, aUrl, deUrl } from '../../filtros'
import { useCombos } from '../../hooks/useCombos'
import { useGenerarReporte } from '../../hooks/useGenerarReporte'
import { definicionDe, OPCIONES_REPORTE } from '../../textos'
import type { FiltrosReporte, FormatoReporte } from '../../types'

export const ReportesPage = () => {
    const [parametros, setParametros] = useSearchParams()
    const filtros = deUrl(parametros)
    const definicion = definicionDe(filtros.reporte)
    const combos = useCombos(definicion?.filtros.includes('elemento') ?? false)
    const { formatoEnCurso, errores, generar, limpiarErrores } = useGenerarReporte()

    const cambiar = (cambios: Partial<FiltrosReporte>) => {
        limpiarErrores()
        setParametros(aUrl({ ...filtros, ...cambios }), { replace: true })
    }

    const elegirReporte = (codigo: string) => {
        const elegida = definicionDe(codigo)
        limpiarErrores()
        setParametros(aUrl(elegida ? alElegirReporte(filtros, elegida) : { ...filtros, reporte: '' }), {
            replace: true,
        })
    }

    const descargar = (formato: FormatoReporte) => {
        if (definicion) {
            void generar(definicion.codigo, formato, aConsulta(filtros))
        }
    }

    // REP-05 se genera para un elemento
    const incompleto = definicion?.filtros.includes('elemento') === true && filtros.elemento === ''
    // El 422 de formato o de elementoId no tiene un campo propio a la vista
    const errorGeneral = errores.formato ?? errores.elementoId

    return (
        <Pantalla
            titulo="Reportes"
            descripcion="Genere y descargue reportes de hallazgos y deuda técnica en Excel o PDF, con los filtros que elija."
        >
            <div style={columna(spacing.md)}>
                <FieldInput label="Reporte">
                    <Select
                        options={OPCIONES_REPORTE}
                        value={opcionDe(OPCIONES_REPORTE, filtros.reporte)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        placeholder="Seleccione un reporte…"
                        onChange={(opcion) => elegirReporte(opcion.valor)}
                    />
                </FieldInput>

                {definicion ? (
                    <>
                        <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                            {definicion.descripcion}
                        </Text>
                        <FiltrosDelReporte
                            definicion={definicion}
                            filtros={filtros}
                            onCambiar={cambiar}
                            combos={combos}
                            errores={errores}
                        />
                        {errorGeneral && <Alert variant="error" description={errorGeneral} />}
                        <BotonesDeDescarga
                            definicion={definicion}
                            incompleto={incompleto}
                            formatoEnCurso={formatoEnCurso}
                            onDescargar={descargar}
                        />
                    </>
                ) : (
                    <EmptyState
                        iconName="file_lines"
                        title="Elija un reporte"
                        description="Al elegirlo verá los filtros que usa y podrá descargarlo en Excel o PDF."
                    />
                )}
            </div>
        </Pantalla>
    )
}
