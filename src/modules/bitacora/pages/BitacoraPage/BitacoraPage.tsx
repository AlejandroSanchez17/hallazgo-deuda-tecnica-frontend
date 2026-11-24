import { spacing } from '@hnba/design-tokens'
import { Alert, Pagination, Table } from '@hnba/react-ui'
import { useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { rutaCambioBitacora } from '../../../../utils/constants/rutas'
import { aErroresCampo } from '../../../../utils/erroresCampo'
import { accionesBitacora, columnasBitacora } from '../../columnas'
import { BarraBitacora } from '../../components/BarraBitacora/BarraBitacora'
import { aConsulta, aUrl, deUrl, paginacionAUrl, paginacionDeUrl, TAMANOS_PAGINA, type Paginacion } from '../../filtros'
import { useBitacora } from '../../hooks/useBitacora'
import { useCombos } from '../../hooks/useCombos'
import { TEXTOS } from '../../textos'
import type { FiltrosBitacora } from '../../types'

export const BitacoraPage = () => {
    const [parametros, setParametros] = useSearchParams()
    const filtros = deUrl(parametros)
    const puedeVerUsuarios = usePermiso(PERMISOS.usuarioLeer)
    const combos = useCombos(puedeVerUsuarios)
    const { ir, reemplazar } = useNavegacion()
    const { pagina, tamano } = paginacionDeUrl(parametros)
    const { registros, total, cargando, error } = useBitacora(aConsulta(filtros), pagina, tamano)
    const actualizarUrl = (nuevos: FiltrosBitacora, paginacion: Paginacion) =>
        setParametros({ ...aUrl(nuevos), ...paginacionAUrl(paginacion) }, reemplazar)

    // Un 422 (hasta anterior a desde) se marca en su campo; los demas errores (400) salen en un Alert
    const errores = aErroresCampo(error?.errores ?? [])
    const errorGeneral = error !== null && Object.keys(errores).length === 0 ? error : null

    return (
        <Pantalla titulo={TEXTOS.titulo} descripcion={TEXTOS.descripcion}>
            <div style={columna(spacing.md)}>
                <BarraBitacora
                    filtros={filtros}
                    onFiltrar={(nuevos) => actualizarUrl(nuevos, { pagina: 1, tamano })}
                    combos={combos}
                    conUsuario={puedeVerUsuarios}
                    errores={errores}
                />

                {errorGeneral ? (
                    <Alert variant="error" description={errorGeneral.mensaje} />
                ) : (
                    <div style={columna(spacing.md)}>
                        <Table
                            columns={columnasBitacora}
                            rowActions={accionesBitacora((registro) =>
                                ir(rutaCambioBitacora(registro.id), { registro }),
                            )}
                            getRowLabel={(registro) => `registro ${registro.id}`}
                            rows={registros}
                            getRowKey={(registro) => String(registro.id)}
                            loading={cargando}
                            emptyText={TEXTOS.sinRegistros}
                        />
                        {!cargando && total > 0 && (
                            // El total y las paginas vienen del backend; pageSizePosition es la posicion del selector de filas
                            <Pagination
                                page={pagina}
                                totalRecords={total}
                                pageSize={tamano}
                                pageSizeOptions={TAMANOS_PAGINA}
                                showPageSizeSelector
                                pageSizePosition="left"
                                onPageChange={(nueva) => actualizarUrl(filtros, { pagina: nueva, tamano })}
                                onPageSizeChange={(nuevo) => actualizarUrl(filtros, { pagina: 1, tamano: nuevo })}
                            />
                        )}
                    </div>
                )}
            </div>
        </Pantalla>
    )
}
