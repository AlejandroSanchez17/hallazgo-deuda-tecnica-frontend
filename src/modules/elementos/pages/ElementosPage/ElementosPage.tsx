import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { normalizar } from '../../../../utils/texto'
import { elementosApi } from '../../api'
import { accionesEditar, columnaSemaforo } from '../../columnas'
import { BarraElementos } from '../../components/BarraElementos/BarraElementos'
import { ElementoForm } from '../../components/ElementoForm/ElementoForm'
import { filtrarElementos, hayFiltros, opcionesDeFiltro, SIN_FILTROS } from '../../filtros'
import { useFichaElemento } from '../../hooks/useFichaElemento'
import { useLista } from '../../hooks/useLista'
import { usePermisosElementos } from '../../hooks/usePermisosElementos'
import { TEXTO_ESTADO, TEXTO_TIPO } from '../../textos'
import type { ElementoResponse, FiltrosElementos } from '../../types'

// Codigo, tipo y fecha no se parten en dos lineas (las celdas saltan de linea por una regla global)
const sinCortar = (texto: string) => <span style={{ whiteSpace: 'nowrap' }}>{texto}</span>

const columnas: TableColumn<ElementoResponse>[] = [
    { id: 'codigo', header: 'Código', render: (elemento) => sinCortar(elemento.codigo) },
    { id: 'tipo', header: 'Tipo', render: (elemento) => sinCortar(TEXTO_TIPO[elemento.tipo]) },
    { id: 'titulo', header: 'Título', accessor: (elemento) => elemento.titulo },
    { id: 'criticidad', header: 'Criticidad', accessor: (elemento) => elemento.criticidadNombre },
    { id: 'equipo', header: 'Equipo', accessor: (elemento) => elemento.equipoNombre },
    { id: 'estado', header: 'Estado', accessor: (elemento) => TEXTO_ESTADO[elemento.estado] },
    {
        id: 'compromiso',
        header: 'Compromiso',
        align: 'center',
        render: (elemento) => sinCortar(formatearFecha(elemento.fechaCompromisoVigente)),
    },
    columnaSemaforo,
]

export const ElementosPage = () => {
    const [busqueda, setBusqueda] = useState('')
    const [filtros, setFiltros] = useState<FiltrosElementos>(SIN_FILTROS)
    const { registros, cargando, error, recargar } = useLista(elementosApi.listar)
    const { edicion, abrirNuevo, abrirEdicion, cerrar } = useFichaElemento()
    const { puedeCrear, muestraEditar, puedeEditar } = usePermisosElementos()

    const termino = normalizar(busqueda)
    const filas = filtrarElementos(registros, termino, filtros)
    const opciones = opcionesDeFiltro(registros)
    const acciones = accionesEditar(muestraEditar ? abrirEdicion : undefined, puedeEditar)

    const alGuardar = () => {
        cerrar()
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo="Hallazgos y deuda técnica"
                descripcion="Hallazgos de auditoría y deuda técnica registrados, con su equipo, su fecha compromiso y el semáforo de vencimiento."
            >
                <div style={columna(spacing.md)}>
                    <BarraElementos
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        filtros={filtros}
                        onFiltrar={setFiltros}
                        criticidades={opciones.criticidades}
                        equipos={opciones.equipos}
                        origenes={opciones.origenes}
                        accion={
                            puedeCrear ? (
                                <Button variant="primary" iconName="plus" onClick={abrirNuevo}>
                                    Nuevo elemento
                                </Button>
                            ) : undefined
                        }
                    />

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={columnas}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(elemento) => elemento.id}
                            etiquetaFila={(elemento) => `${elemento.codigo} ${elemento.titulo}`}
                            claveReinicio={`${termino}|${Object.values(filtros).join('|')}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && !hayFiltros(filtros)
                                    ? 'No hay hallazgos ni deuda técnica registrados'
                                    : 'Ningún elemento coincide con la búsqueda o los filtros'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && <ElementoForm ficha={edicion} onCerrar={cerrar} onGuardado={alGuardar} />}
        </>
    )
}
