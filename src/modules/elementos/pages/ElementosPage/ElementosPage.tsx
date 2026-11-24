import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EnlaceVolver } from '../../../../components/common/EnlaceVolver/EnlaceVolver'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../../../components/common/TextoSinCorte/TextoSinCorte'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna, fila } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { RUTAS, rutaElemento, rutaReporte } from '../../../../utils/constants/rutas'
import { formatearFecha } from '../../../../utils/formato'
import { normalizar } from '../../../../utils/texto'
import { elementosApi } from '../../api'
import { accionesEditar, accionVer, columnaPlazo, columnaSemaforo } from '../../columnas'
import { BarraElementos } from '../../components/BarraElementos/BarraElementos'
import { ElementoForm } from '../../components/ElementoForm/ElementoForm'
import { filtrarElementos, filtrosAUrl, filtrosDeUrl, hayFiltros, opcionesDeFiltro } from '../../filtros'
import { useFichaElemento } from '../../hooks/useFichaElemento'
import { useLista } from '../../hooks/useLista'
import { usePermisosElementos } from '../../hooks/usePermisosElementos'
import { TEXTO_ESTADO, TEXTO_TIPO, TEXTOS_LISTA } from '../../textos'
import type { ElementoResponse, FiltrosElementos, TipoElemento } from '../../types'

const columnaTipo: TableColumn<ElementoResponse> = {
    id: 'tipo',
    header: 'Tipo',
    render: (elemento) => <TextoSinCorte>{TEXTO_TIPO[elemento.tipo]}</TextoSinCorte>,
}

const columnas: TableColumn<ElementoResponse>[] = [
    { id: 'codigo', header: 'Código', render: (elemento) => <TextoSinCorte>{elemento.codigo}</TextoSinCorte> },
    columnaTipo,
    { id: 'titulo', header: 'Título', render: (elemento) => <TextoCorto texto={elemento.titulo} ancho={220} /> },
    { id: 'criticidad', header: 'Criticidad', accessor: (elemento) => elemento.criticidadNombre },
    { id: 'equipo', header: 'Equipo', render: (elemento) => <TextoCorto texto={elemento.equipoNombre} ancho={110} /> },
    // Como titulo y equipo: una sola linea y, si no cabe, puntos suspensivos con el texto completo al pasar el mouse
    {
        id: 'estado',
        header: 'Estado',
        render: (elemento) => <TextoCorto texto={TEXTO_ESTADO[elemento.estado]} ancho={110} />,
    },
    {
        id: 'compromiso',
        header: 'Compromiso',
        align: 'center',
        render: (elemento) => <TextoSinCorte>{formatearFecha(elemento.fechaCompromisoVigente)}</TextoSinCorte>,
    },
    columnaSemaforo,
    columnaPlazo,
]

// En la lista de un solo tipo todas las filas valen lo mismo: la columna Tipo sobra
const columnasDeUnTipo = columnas.filter((columna) => columna !== columnaTipo)

interface ElementosPageProps {
    // Sin tipo es la lista combinada (/elementos), a la que llegan los enlaces del tablero
    tipo?: TipoElemento
}

export const ElementosPage = ({ tipo }: ElementosPageProps) => {
    const { origen, ir, volver, reemplazar } = useNavegacion()
    const [busqueda, setBusqueda] = useState('')
    const [parametros, setParametros] = useSearchParams()
    // En la lista de un tipo, el tipo de la URL se ignora
    const filtros = tipo ? { ...filtrosDeUrl(parametros), tipo: '' } : filtrosDeUrl(parametros)
    // La lista combinada (sin tipo) solo existe para ver lo que filtra el tablero: sin filtros ni busqueda mezclaria
    // hallazgos y deuda en una sola tabla, asi que al quitar el ultimo filtro se vuelve al tablero
    const setFiltros = (nuevos: FiltrosElementos) => {
        if (!tipo && !hayFiltros(nuevos) && normalizar(busqueda) === '') {
            volver(RUTAS.tablero)
            return
        }
        setParametros(filtrosAUrl(nuevos), reemplazar)
    }
    // Si se llego desde una cifra del tablero, los filtros son los de esa cifra y no se cambian
    const desdeTablero = !tipo && hayFiltros(filtros) && origen?.ruta.split('?')[0] === RUTAS.tablero
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
        accionVer((elemento) => ir(rutaElemento(elemento.id))),
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
    // El boton de exportar solo aparece si hay algun vencido entre lo que el reporte tomaria: los mismos filtros, sin la
    // busqueda ni el semaforo (con el filtro de semaforo en "En tiempo" el reporte igual traeria los vencidos)
    const hayVencidos = filtrarElementos(delTipo, '', { ...filtros, semaforo: '' }).some(
        (elemento) => elemento.semaforo === 'VENCIDO',
    )
    const puedeExportar = veReportes && hayVencidos

    const alGuardar = () => {
        cerrar()
        recargar()
    }

    return (
        <>
            <Pantalla
                // Solo si se llego desde otra pantalla
                volver={origen && <EnlaceVolver texto={origen.etiqueta} onClick={() => volver(RUTAS.tablero)} />}
                titulo={textos?.titulo ?? 'Hallazgos y deuda técnica'}
                descripcion={textos?.descripcion ?? 'Hallazgos y deuda técnica en una sola lista.'}
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
                        filtrosFijos={desdeTablero}
                        accion={
                            puedeExportar || puedeCrear ? (
                                <div style={fila(spacing.sm)}>
                                    {puedeExportar && (
                                        // Abre REP-03 (vencidos y proximos a vencer) con los filtros que tiene la lista
                                        <Button
                                            variant="outlined"
                                            iconName="download"
                                            onClick={() => ir(rutaReporte('REP-03', filtrosDelReporte))}
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
