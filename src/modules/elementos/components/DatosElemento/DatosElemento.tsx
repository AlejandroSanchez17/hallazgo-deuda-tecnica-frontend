import { spacing } from '@hnba/design-tokens'
import { Badge, Card, Divider, Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { anchoCompleto, columna, fila, rejillaFormulario, textoSecundario } from '../../../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../../../utils/formato'
import type { ElementoDetalleResponse } from '../../types'

interface DatosElementoProps {
    ficha: ElementoDetalleResponse
}

const campo = (etiqueta: string, valor: ReactNode, ancho = false) => (
    <div style={{ ...columna(4), ...(ancho ? anchoCompleto : {}) }}>
        <Text variant="label-bold-medium" style={textoSecundario}>
            {etiqueta}
        </Text>
        <Text variant="body-regular-medium" as="div" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {valor === null || valor === '' ? '—' : valor}
        </Text>
    </div>
)

const seccion = (titulo: string, contenido: ReactNode) => (
    <div style={columna(spacing.md)}>
        <Text variant="h6" as="h2" style={{ margin: 0 }}>
            {titulo}
        </Text>
        <div style={rejillaFormulario}>{contenido}</div>
    </div>
)

const horas = (valor: number | null) => (valor === null ? null : `${valor} ${valor === 1 ? 'hora' : 'horas'}`)

// Pestana "Datos": todo lo registrado del elemento, en solo lectura
export const DatosElemento = ({ ficha }: DatosElementoProps) => {
    const { hallazgo, deuda } = ficha
    const fechaCambiada = ficha.fechaCompromisoOriginal !== ficha.fechaCompromisoSugerida

    return (
        <Card padding={24}>
            <div style={columna(spacing.lg)}>
                {seccion(
                    'Descripción',
                    <>
                        {campo('Título', ficha.titulo, true)}
                        {campo('Descripción', ficha.descripcion, true)}
                        {campo(
                            'Aplicaciones',
                            ficha.aplicaciones.length === 0 ? null : (
                                <div style={fila(spacing.sm)}>
                                    {ficha.aplicaciones.map((aplicacion) => (
                                        <Badge key={aplicacion.id} status="neutral" label={aplicacion.nombre} />
                                    ))}
                                </div>
                            ),
                            true,
                        )}
                        {campo('Registrado por', ficha.registradorNombre)}
                        {campo('Fecha de registro', formatearFechaHora(ficha.fechaRegistro))}
                    </>,
                )}
                <Divider />
                {seccion(
                    'Fechas',
                    <>
                        {campo('Identificación', formatearFecha(ficha.fechaIdentificacion))}
                        {campo('Compromiso sugerido', formatearFecha(ficha.fechaCompromisoSugerida))}
                        {campo('Compromiso original', formatearFecha(ficha.fechaCompromisoOriginal))}
                        {campo('Compromiso vigente', formatearFecha(ficha.fechaCompromisoVigente))}
                        {fechaCambiada && campo('Justificación de la fecha', ficha.justificacionFecha, true)}
                        {ficha.fechaCierre && campo('Cierre', formatearFecha(ficha.fechaCierre))}
                    </>,
                )}
                <Divider />
                {hallazgo &&
                    seccion(
                        'Datos del hallazgo',
                        <>
                            {campo('Referencia del informe', hallazgo.referenciaInforme)}
                            {campo('Ente emisor', hallazgo.enteEmisor)}
                            {campo('Recomendación', hallazgo.recomendacion, true)}
                            {campo('Riesgo asociado', hallazgo.riesgoAsociado, true)}
                        </>,
                    )}
                {deuda &&
                    seccion(
                        'Datos de la deuda técnica',
                        <>
                            {campo(
                                'Categoría',
                                <span style={fila(spacing.sm)}>
                                    {deuda.categoriaDeudaNombre}
                                    {deuda.restringida && <Badge status="warning" label="Restringida" />}
                                </span>,
                            )}
                            {campo('Componente', deuda.componente)}
                            {campo('Esfuerzo en horas', horas(deuda.esfuerzoHoras))}
                            {campo('Talla', deuda.talla)}
                            {campo('Causa', deuda.causa, true)}
                            {campo('Impacto técnico', deuda.impactoTecnico, true)}
                            {campo('Impacto en el negocio', deuda.impactoNegocio, true)}
                        </>,
                    )}
            </div>
        </Card>
    )
}
