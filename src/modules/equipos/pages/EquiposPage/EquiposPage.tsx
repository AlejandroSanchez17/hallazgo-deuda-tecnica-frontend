import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna } from '../../../../styles/disposicion'
import { rutaEquipo } from '../../../../utils/constants/rutas'
import { coincide, normalizar } from '../../../../utils/texto'
import { equiposApi } from '../../api'
import { accionesEditar, accionVer, columnaEstado, columnasActivar, nombreLider } from '../../columnas'
import { BarraEquipos } from '../../components/BarraEquipos/BarraEquipos'
import { EquipoForm } from '../../components/EquipoForm/EquipoForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useLista } from '../../hooks/useLista'
import { usePermisosEquipos } from '../../hooks/usePermisosEquipos'
import { TEXTOS } from '../../textos'
import type { Edicion, EquipoResponse, FiltroEstado } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

export const EquiposPage = () => {
    const { ir } = useNavegacion()
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<EquipoResponse>>(undefined)
    const { registros, cargando, error, recargar } = useLista(equiposApi.listar, filtro)
    const { cambiarEstado, dialogo } = useCambiarEstado(equiposApi.cambiarEstado, TEXTOS.equipo, recargar)
    const { puedeCrear, puedeEditar, puedeDesactivar } = usePermisosEquipos()

    const termino = normalizar(busqueda)
    const filas = registros.filter((equipo) => coincide(termino, equipo.nombre, equipo.areaNombre, equipo.liderNombre))

    const columnas: TableColumn<EquipoResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (equipo) => <TextoCorto texto={equipo.nombre} ancho={240} /> },
        { id: 'area', header: 'Área', render: (equipo) => <TextoCorto texto={equipo.areaNombre} ancho={220} /> },
        { id: 'lider', header: 'Líder', render: (equipo) => nombreLider(equipo.liderNombre) },
        { id: 'miembros', header: 'Miembros', align: 'center', accessor: (equipo) => equipo.cantidadMiembros },
        columnaEstado<EquipoResponse>(TEXTOS.equipo),
        ...columnasActivar<EquipoResponse>(TEXTOS.equipo, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = [
        accionVer<EquipoResponse>((equipo) => ir(rutaEquipo(equipo.id))),
        ...accionesEditar<EquipoResponse>(puedeEditar ? setEdicion : undefined),
    ]

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla titulo="Equipos técnicos" descripcion="Equipos que atienden hallazgos y deuda técnica.">
                <div style={columna(spacing.md)}>
                    <BarraEquipos
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <Button variant="primary" iconName="plus" onClick={() => setEdicion(null)}>
                                    Nuevo equipo
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
                            claveFila={(equipo) => equipo.id}
                            etiquetaFila={(equipo) => equipo.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay equipos con este filtro'
                                    : 'Ningún equipo coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <EquipoForm equipo={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
