import { DatePicker, FieldInput, Select } from '@hnba/react-ui'
import { rejillaFormulario } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { aFechaApi } from '../../../../utils/formato'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { deFechaApi, opcionesDeMes } from '../../filtros'
import type { CombosReporte } from '../../hooks/useCombos'
import { ETIQUETA_FILTRO, OPCIONES_ESTADO, OPCIONES_TIPO } from '../../textos'
import type { CampoFiltro, DefinicionReporte, FiltrosReporte } from '../../types'

interface FiltrosDelReporteProps {
    definicion: DefinicionReporte
    filtros: FiltrosReporte
    onCambiar: (cambios: Partial<FiltrosReporte>) => void
    combos: CombosReporte
    errores: ErroresCampo
}

const AYUDA: Partial<Record<CampoFiltro, string>> = {
    estado: 'Sin elegir, no se incluyen los anulados.',
    area: 'Incluye sus sub-áreas.',
}

const CAMPO_ERROR: Partial<Record<CampoFiltro, string>> = { elemento: 'elementoId' }

const MESES_OFRECIDOS = 24

export const FiltrosDelReporte = ({ definicion, filtros, onCambiar, combos, errores }: FiltrosDelReporteProps) => {
    const hoy = new Date()
    const opcionesDe: Record<CampoFiltro, Opcion[]> = {
        tipo: OPCIONES_TIPO,
        estado: OPCIONES_ESTADO,
        criticidad: combos.criticidades,
        origen: combos.origenes,
        area: combos.areas,
        equipo: combos.equipos,
        lider: combos.lideres,
        aplicacion: combos.aplicaciones,
        elemento: combos.elementos,
    }

    const selector = (campo: CampoFiltro) => {
        // Elemento no admite "Todos": REP-05 se genera para uno
        const obligatorio = campo === 'elemento'
        const opciones = obligatorio ? opcionesDe[campo] : [{ valor: '', texto: 'Todos' }, ...opcionesDe[campo]]
        return (
            <FieldInput
                key={campo}
                label={ETIQUETA_FILTRO[campo]}
                optional={!obligatorio}
                helperText={AYUDA[campo]}
                errorText={errores[CAMPO_ERROR[campo] ?? campo]}
            >
                <Select
                    options={opciones}
                    value={opcionDe(opciones, filtros[campo])}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable={opciones.length > 8}
                    placeholder={obligatorio ? 'Seleccione…' : undefined}
                    onChange={(opcion) => onCambiar({ [campo]: opcion.valor })}
                />
            </FieldInput>
        )
    }

    const fecha = (campo: 'desde' | 'hasta', etiqueta: string) => {
        const desde = filtros.desde ? deFechaApi(filtros.desde) : undefined
        return (
            <FieldInput key={campo} label={etiqueta} optional errorText={errores[campo]}>
                <DatePicker
                    value={filtros[campo] ? deFechaApi(filtros[campo]) : null}
                    // Hasta no baja de Desde ni pasa de hoy
                    minDate={campo === 'hasta' ? desde : undefined}
                    maxDate={hoy}
                    placeholder="DD/MM/AAAA"
                    onChange={(nueva) => onCambiar({ [campo]: aFechaApi(nueva) })}
                />
            </FieldInput>
        )
    }

    const meses = [{ valor: '', texto: 'Mes anterior' }, ...opcionesDeMes(hoy, MESES_OFRECIDOS)]

    return (
        <div style={rejillaFormulario}>
            {definicion.filtros.map(selector)}
            {definicion.periodo === 'fechas' && (
                <>
                    {fecha('desde', 'Desde')}
                    {fecha('hasta', 'Hasta')}
                </>
            )}
            {definicion.periodo === 'mes' && (
                <FieldInput
                    label="Mes"
                    optional
                    helperText="Sin elegir, se usa el mes anterior completo."
                    errorText={errores.hasta ?? errores.desde}
                >
                    <Select
                        options={meses}
                        value={opcionDe(meses, filtros.mes)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        onChange={(opcion) => onCambiar({ mes: opcion.valor })}
                    />
                </FieldInput>
            )}
        </div>
    )
}
