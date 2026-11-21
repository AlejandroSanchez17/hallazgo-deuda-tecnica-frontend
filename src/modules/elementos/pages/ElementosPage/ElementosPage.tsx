import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { columna, fila } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { rutaElemento, rutaReporte } from '../../../../utils/constants/rutas'
import { formatearFecha } from '../../../../utils/formato'
import { normalizar } from '../../../../utils/texto'
import { elementosApi } from '../../api'
import { accionesEditar, accionVer, columnaSemaforo } from '../../columnas'
import { BarraElementos } from '../../components/BarraElementos/BarraElementos'
import { ElementoForm } from '../../components/ElementoForm/ElementoForm'
import { filtrarElementos, filtrosAUrl, filtrosDeUrl, hayFiltros, opcionesDeFiltro } from '../../filtros'
import { useFichaElemento } from '../../hooks/useFichaElemento'
import { useLista } from '../../hooks/useLista'
import { usePermisosElementos } from '../../hooks/usePermisosElementos'
import { TEXTO_ESTADO, TEXTO_TIPO, TEXTOS_LISTA } from '../../textos'
import type { ElementoResponse, FiltrosElementos, TipoElemento } from '../../types'

// Codigo, tipo y fecha no se parten en dos lineas (las celdas saltan de linea por una regla global)
const sinCortar = (texto: string) => <span style={{ whiteSpace: 'nowrap' }}>{texto}</span>

const columnaTipo: TableColumn<ElementoResponse> = {
    id: 'tipo',
    header: 'Tipo',
    render: (elemento) => sinCortar(TEXTO_TIPO[elemento.tipo]),
}

const columnas: TableColumn<ElementoResponse>[] = [
    { id: 'codigo', header: 'Código', render: (elemento) => sinCortar(elemento.codigo) },
    columnaTipo,
    { id: 'titulo', header: 'Título', render: (elemento) => <TextoCorto texto={elemento.titulo} ancho={320} /> },
    { id: 'criticidad', header: 'Criticidad', accessor: (elemento) => elemento.criticidadNombre },
    { id: 'equipo', header: 'Equipo', render: (elemento) => <TextoCorto texto={elemento.equipoNombre} ancho={200} /> },
    { id: 'estado', header: 'Estado', accessor: (elemento) => TEXTO_ESTADO[elemento.estado] },
    {
        id: 'compromiso',
        header: 'Compromiso',
        align: 'center',
        render: (elemento) => sinCortar(formatearFecha(elemento.fechaCompromisoVigente)),
    },
    columnaSemaforo,
]

// En la lista de un solo tipo todas las filas valen lo mismo: la columna Tipo sobra
const columnasDeUnTipo = columnas.filter((columna) => columna !== columnaTipo)

interface ElementosPageProps {
    // Sin tipo es la lista combinada (/elementos), a la que llegan los enlaces del tablero
    tipo?: TipoElemento
}

export const ElementosPage = ({ tipo }: ElementosPageProps) => {
    const navegar = useNavigate()
    const [busqueda, setBusqueda] = useState('')
    const [parametros, setParametros] = useSearchParams()
    // En la lista de un tipo, el tipo de la URL se ignora
    const filtros = tipo ? { ...filtrosDeUrl(parametros), tipo: '' } : filtrosDeUrl(parametros)
    const setFiltros = (nuevos: FiltrosElementos) => setParametros(filtrosAUrl(nuevos), { replace: true })
    const { registros, cargando, error, recargar } = useLista(elementosApi.listar)
    const { edicion, abrirNuevo, abrirEdicion, cerrar } = useFichaElemento()
    const { puedeCrear, muestraEditar, puedeEditar } = usePermisosElementos()
    const veReportes = usePermiso(PERMISOS.reporteLeer)

    const termino = normalizar(busqueda)
    const delTipo = tipo ? registros.filter((elemento) => elemento.tipo === tipo) : registros
    const filas = filtrarElementos(delTipo, termino, filtros)
    const opciones = opcionesDeFiltro(delTipo)
    const textos = tipo ? TEXTOS_LISTA[tipo] : undefined
    const acciones = [
        accionVer((elemento) => void navegar(rutaElemento(elemento.id))),
        ...accionesEditar(muestraEditar ? abrirEdicion : undefined, puedeEditar),
    ]

    // El semaforo no se manda: el reporte ya trae los vencidos y los proximos a vencer
    const filtrosDelReporte = {
        tipo: tipo ?? filtros.tipo,
        estado: filtros.estado,
        criticidad: filtros.criticidad,
        equipo: filtros.equipo,
        origen: filtros.origen,
    }

    const alGuardar = () => {
        cerrar()
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo={textos?.titulo ?? 'Hallazgos y deuda técnica'}
                descripcion={
                    textos?.descripcion ??
                    'Hallazgos de auditoría y deuda técnica registrados, con su equipo, su fecha compromiso y el semáforo de vencimiento.'
                }
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
                        ocultarTipo={tipo !== undefined}
                        accion={
                            veReportes || puedeCrear ? (
                                <div style={fila(spacing.sm)}>
                                    {veReportes && (
                                        // Abre REP-03 (vencidos y proximos a vencer) con los filtros que tiene la lista
                                        <Button
                                            variant="outlined"
                                            iconName="download"
                                            onClick={() => void navegar(rutaReporte('REP-03', filtrosDelReporte))}
                                        >
                                            Exportar vencidos
                                        </Button>
                                    )}
                                    {puedeCrear && (
                                        <Button variant="primary" iconName="plus" onClick={abrirNuevo}>
                                            {textos?.botonNuevo ?? 'Nuevo elemento'}
                                        </Button>
                                    )}
                                </div>
                            ) : undefined
                        }
                    />

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={tipo ? columnasDeUnTipo : columnas}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(elemento) => elemento.id}
                            etiquetaFila={(elemento) => `${elemento.codigo} ${elemento.titulo}`}
                            claveReinicio={`${termino}|${Object.values(filtros).join('|')}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && !hayFiltros(filtros)
                                    ? (textos?.textoVacio ?? 'No hay hallazgos ni deuda técnica registrados')
                                    : 'Ningún elemento coincide con la búsqueda o los filtros'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <ElementoForm ficha={edicion} tipo={tipo} onCerrar={cerrar} onGuardado={alGuardar} />
            )}
        </>
    )
}
