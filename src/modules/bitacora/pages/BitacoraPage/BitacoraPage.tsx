import { spacing } from '@hnba/design-tokens'
import { Alert, Pagination, Table } from '@hnba/react-ui'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { columna } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { aErroresCampo } from '../../../../utils/erroresCampo'
import { accionesBitacora, columnasBitacora } from '../../columnas'
import { BarraBitacora } from '../../components/BarraBitacora/BarraBitacora'
import { DetalleCambio } from '../../components/DetalleCambio/DetalleCambio'
import { aConsulta, aUrl, deUrl } from '../../filtros'
import { TAMANOS_PAGINA, useBitacora } from '../../hooks/useBitacora'
import { useCombos } from '../../hooks/useCombos'
import { TEXTOS } from '../../textos'
import type { RegistroBitacora } from '../../types'

export const BitacoraPage = () => {
    const [parametros, setParametros] = useSearchParams()
    const filtros = deUrl(parametros)
    const puedeVerUsuarios = usePermiso(PERMISOS.usuarioLeer)
    const combos = useCombos(puedeVerUsuarios)
    const [detalle, setDetalle] = useState<RegistroBitacora | null>(null)
    const { registros, total, cargando, error, pagina, tamano, irAPagina, cambiarTamano } = useBitacora(
        aConsulta(filtros),
    )

    // Un 422 (hasta anterior a desde) se marca en su campo; los demas errores (400) salen en un Alert
    const errores = aErroresCampo(error?.errores ?? [])
    const errorGeneral = error !== null && Object.keys(errores).length === 0 ? error : null

    return (
        <>
            <Pantalla titulo={TEXTOS.titulo} descripcion={TEXTOS.descripcion}>
                <div style={columna(spacing.md)}>
                    <BarraBitacora
                        filtros={filtros}
                        onFiltrar={(nuevos) => setParametros(aUrl(nuevos), { replace: true })}
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
                                rowActions={accionesBitacora(setDetalle)}
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
                                    onPageChange={irAPagina}
                                    onPageSizeChange={cambiarTamano}
                                />
                            )}
                        </div>
                    )}
                </div>
            </Pantalla>

            {detalle && <DetalleCambio registro={detalle} onCerrar={() => setDetalle(null)} />}
        </>
    )
}
