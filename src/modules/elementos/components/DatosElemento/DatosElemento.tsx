import { spacing } from '@hnba/design-tokens'
import { Badge, Card, Divider, Text } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, fila } from '../../../../styles/disposicion'
import { formatearFecha, formatearFechaHora } from '../../../../utils/formato'
import type { ElementoDetalleResponse } from '../../types'
import { fichaDato, fichaTexto, rejillaFichas } from '../Fichas/Fichas'

interface DatosElementoProps {
    ficha: ElementoDetalleResponse
}

const seccion = (titulo: string, contenido: ReactNode) => (
    <div style={columna(spacing.md)}>
        <Text variant="h4" as="h2" style={{ margin: 0 }}>
            {titulo}
        </Text>
        {contenido}
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
                        {fichaTexto('Detalle', ficha.descripcion)}
                        {rejillaFichas(
                            3,
                            <>
                                {fichaDato(
                                    'Aplicaciones',
                                    ficha.aplicaciones.map((aplicacion) => aplicacion.nombre).join(', '),
                                )}
                                {fichaDato('Registrado por', ficha.registradorNombre)}
                                {fichaDato('Fecha de registro', formatearFechaHora(ficha.fechaRegistro))}
                            </>,
                        )}
                    </>,
                )}
                <Divider />
                {seccion(
                    'Equipo de trabajo',
                    fichaTexto(
                        'Participantes',
                        ficha.participantes.length > 0
                            ? ficha.participantes.map((participante) => participante.nombre).join(', ')
                            : 'Los participantes se mostrarán cuando el plan esté aprobado.',
                    ),
                )}
                <Divider />
                {seccion(
                    'Fechas importantes',
                    <>
                        {rejillaFichas(
                            // Con cierre son cinco fechas: caben en una sola fila
                            ficha.fechaCierre ? 5 : 4,
                            <>
                                {fichaDato('Identificación', formatearFecha(ficha.fechaIdentificacion))}
                                {fichaDato('Compromiso sugerido', formatearFecha(ficha.fechaCompromisoSugerida))}
                                {fichaDato('Compromiso original', formatearFecha(ficha.fechaCompromisoOriginal))}
                                {fichaDato('Compromiso vigente', formatearFecha(ficha.fechaCompromisoVigente))}
                                {ficha.fechaCierre && fichaDato('Cierre', formatearFecha(ficha.fechaCierre))}
                            </>,
                        )}
                        {fechaCambiada && fichaTexto('Justificación de la fecha', ficha.justificacionFecha)}
                    </>,
                )}
                <Divider />
                {hallazgo &&
                    seccion(
                        'Datos del hallazgo',
                        <>
                            {rejillaFichas(
                                2,
                                <>
                                    {fichaDato('Referencia del informe', hallazgo.referenciaInforme)}
                                    {fichaDato('Ente emisor', hallazgo.enteEmisor)}
                                </>,
                            )}
                            {rejillaFichas(
                                2,
                                <>
                                    {fichaTexto('Recomendación', hallazgo.recomendacion)}
                                    {fichaTexto('Riesgo asociado', hallazgo.riesgoAsociado)}
                                </>,
                            )}
                        </>,
                    )}
                {deuda &&
                    seccion(
                        'Datos de la deuda técnica',
                        <>
                            {rejillaFichas(
                                4,
                                <>
                                    {fichaDato(
                                        'Categoría',
                                        <span style={fila(spacing.sm)}>
                                            {deuda.categoriaDeudaNombre}
                                            {deuda.restringida && <Badge status="warning" label="Restringida" />}
                                        </span>,
                                    )}
                                    {fichaDato('Componente', deuda.componente)}
                                    {fichaDato('Esfuerzo en horas', horas(deuda.esfuerzoHoras))}
                                    {fichaDato('Talla', deuda.talla)}
                                </>,
                            )}
                            {rejillaFichas(
                                3,
                                <>
                                    {fichaTexto('Causa', deuda.causa)}
                                    {fichaTexto('Impacto técnico', deuda.impactoTecnico)}
                                    {fichaTexto('Impacto en el negocio', deuda.impactoNegocio)}
                                </>,
                            )}
                        </>,
                    )}
            </div>
        </Card>
    )
}
