import { spacing } from '@hnba/design-tokens'
import { Button, DatePicker, FieldInput, Select, TextInput } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { aFechaApi } from '../../../../utils/formato'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { deFechaApi, hayFiltros, SIN_FILTROS } from '../../filtros'
import type { CombosBitacora } from '../../hooks/useCombos'
import { OPCIONES_ACCION } from '../../textos'
import type { FiltrosBitacora } from '../../types'

interface BarraBitacoraProps {
    filtros: FiltrosBitacora
    onFiltrar: (filtros: FiltrosBitacora) => void
    combos: CombosBitacora
    // Sin USUARIO:LEER no hay lista de usuarios y el filtro no se ofrece
    conUsuario: boolean
    errores: ErroresCampo
}

const MINIMO = 130

// Cada filtro con su etiqueta: las fechas necesitan una, y asi todos se leen igual
const campo: React.CSSProperties = { flex: `1 1 ${MINIMO}px`, minWidth: MINIMO, maxWidth: 220 }

const fila: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: spacing.sm,
}

// Los filtros se aplican al elegirlos (como el listado de elementos): el backend pagina y filtra
export const BarraBitacora = ({ filtros, onFiltrar, combos, conUsuario, errores }: BarraBitacoraProps) => {
    const hoy = new Date()
    const cambiar = (cambios: Partial<FiltrosBitacora>) => onFiltrar({ ...filtros, ...cambios })

    const selector = (clave: 'entidad' | 'usuario' | 'accion', etiqueta: string, todas: string, opciones: Opcion[]) => {
        const conTodas = [{ valor: '', texto: todas }, ...opciones]
        return (
            <div key={clave} style={campo}>
                <FieldInput label={etiqueta} optional>
                    <Select
                        options={conTodas}
                        value={opcionDe(conTodas, filtros[clave])}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        searchable={conTodas.length > 8}
                        onChange={(opcion) => cambiar({ [clave]: opcion.valor })}
                    />
                </FieldInput>
            </div>
        )
    }

    const fecha = (clave: 'desde' | 'hasta', etiqueta: string): ReactNode => (
        <div key={clave} style={campo}>
            <FieldInput label={etiqueta} optional errorText={errores[clave]}>
                <DatePicker
                    value={filtros[clave] ? deFechaApi(filtros[clave]) : null}
                    // Hasta no baja de Desde ni pasa de hoy
                    minDate={clave === 'hasta' && filtros.desde ? deFechaApi(filtros.desde) : undefined}
                    maxDate={hoy}
                    placeholder="DD/MM/AAAA"
                    onChange={(nueva) => cambiar({ [clave]: aFechaApi(nueva) })}
                />
            </FieldInput>
        </div>
    )

    return (
        <div style={fila}>
            {selector('entidad', 'Entidad', 'Todas', combos.entidades)}
            <div style={campo}>
                <FieldInput label="Registro" optional errorText={errores.entidadId}>
                    <TextInput
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Ej. 93"
                        value={filtros.entidadId}
                        onChange={(valor) => cambiar({ entidadId: valor.replace(/\D/g, '') })}
                    />
                </FieldInput>
            </div>
            {selector('accion', 'Acción', 'Todas', OPCIONES_ACCION)}
            {conUsuario && selector('usuario', 'Usuario', 'Todos', combos.usuarios)}
            {fecha('desde', 'Desde')}
            {fecha('hasta', 'Hasta')}
            {hayFiltros(filtros) && (
                // Alineado con los campos: baja lo que mide la etiqueta
                <div style={{ alignSelf: 'flex-end' }}>
                    <Button variant="ghost" iconName="x_clear" onClick={() => onFiltrar(SIN_FILTROS)}>
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    )
}
