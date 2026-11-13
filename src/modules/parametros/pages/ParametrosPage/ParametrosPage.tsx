import { spacing } from '@hnba/design-tokens'
import { Alert, Button, Loader, Table, Text, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Buscador } from '../../../../components/common/Buscador/Buscador'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { columna, paginaAncha, textoSecundario } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { formatearFechaHora } from '../../../../utils/formato'
import { coincide, normalizar } from '../../../../utils/texto'
import { ParametroForm } from '../../components/ParametroForm/ParametroForm'
import { ValorParametro } from '../../components/ValorParametro/ValorParametro'
import { agruparParametros } from '../../grupos'
import { useParametros } from '../../hooks/useParametros'
import type { ParametroResponse } from '../../types'

export const ParametrosPage = () => {
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<ParametroResponse | null>(null)
    const { parametros, cargando, error, recargar } = useParametros()
    const puedeActualizar = usePermiso(PERMISOS.parametroActualizar)

    const termino = normalizar(busqueda)
    const grupos = agruparParametros(
        parametros.filter((parametro) => coincide(termino, parametro.clave, parametro.descripcion, parametro.valor)),
    )

    const columnas: TableColumn<ParametroResponse>[] = [
        {
            id: 'descripcion',
            header: 'Parámetro',
            render: (parametro) => (
                <div>
                    <Text variant="body-regular-medium" as="p" style={{ margin: 0 }}>
                        {parametro.descripcion}
                    </Text>
                    <Text variant="body-regular-small" as="p" style={{ ...textoSecundario, fontFamily: 'monospace' }}>
                        {parametro.clave}
                    </Text>
                </div>
            ),
        },
        { id: 'valor', header: 'Valor', render: (parametro) => <ValorParametro parametro={parametro} /> },
        {
            id: 'fechaModificacion',
            header: 'Última modificación',
            render: (parametro) =>
                parametro.modificadoPorNombre
                    ? `${parametro.modificadoPorNombre} · ${formatearFechaHora(parametro.fechaModificacion)}`
                    : '—',
        },
    ]
    if (puedeActualizar) {
        columnas.push({
            id: 'acciones',
            header: 'Acciones',
            align: 'center',
            render: (parametro) => (
                <Button
                    variant="ghost"
                    size="sm"
                    iconName="edit"
                    aria-label="Editar"
                    title="Editar"
                    onClick={() => setEdicion(parametro)}
                />
            ),
        })
    }

    const alGuardar = () => {
        setEdicion(null)
        recargar()
    }

    return (
        <section style={paginaAncha}>
            <div style={columna(4)}>
                <Text variant="h3" as="h1" style={{ margin: 0 }}>
                    Parámetros
                </Text>
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Valores que ajustan el comportamiento del sistema sin cambiar el código.
                </Text>
            </div>

            <Buscador
                valor={busqueda}
                onCambiar={setBusqueda}
                etiqueta="Buscar parámetros"
                placeholder="Buscar por descripción, clave o valor…"
                ancho={320}
            />

            {cargando && <Loader label="Cargando…" />}
            {error && <Alert variant="error" description={error.mensaje} />}
            {!cargando && !error && grupos.length === 0 && (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Ningún parámetro coincide con la búsqueda.
                </Text>
            )}

            {grupos.map((grupo) => (
                <div key={grupo.titulo} style={columna(spacing.sm)}>
                    <Text variant="h5" as="h2" style={{ margin: 0 }}>
                        {grupo.titulo}
                    </Text>
                    <Table columns={columnas} rows={grupo.parametros} getRowKey={(parametro) => parametro.clave} />
                </div>
            ))}

            {edicion && <ParametroForm parametro={edicion} onCerrar={() => setEdicion(null)} onGuardado={alGuardar} />}
        </section>
    )
}
