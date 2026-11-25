import type { BadgeStatus } from '@hnba/react-ui'
import type { Opcion } from '../../utils/opciones'
import type { AccionBitacora, RegistroBitacora, ValorBitacora } from './types'

export const TEXTO_ACCION: Record<AccionBitacora, string> = {
    CREAR: 'Crear',
    MODIFICAR: 'Modificar',
    CAMBIAR_ESTADO: 'Cambiar estado',
    ELIMINAR: 'Eliminar',
    APROBAR: 'Aprobar',
    RECHAZAR: 'Rechazar',
    ANULAR: 'Anular',
    DESCARGAR_EVIDENCIA: 'Descargar evidencia',
    DESCARGAR_PAQUETE: 'Descargar paquete',
    INICIAR_SESION: 'Iniciar sesión',
}

export const OPCIONES_ACCION: Opcion[] = (Object.keys(TEXTO_ACCION) as AccionBitacora[]).map((valor) => ({
    valor,
    texto: TEXTO_ACCION[valor],
}))

export const ESTADO_ACCION: Record<AccionBitacora, BadgeStatus> = {
    CREAR: 'success',
    MODIFICAR: 'info',
    CAMBIAR_ESTADO: 'info',
    ELIMINAR: 'error',
    APROBAR: 'success',
    RECHAZAR: 'error',
    ANULAR: 'error',
    DESCARGAR_EVIDENCIA: 'neutral',
    DESCARGAR_PAQUETE: 'neutral',
    INICIAR_SESION: 'neutral',
}

// La bitacora guarda el nombre de la tabla; aqui su nombre en el negocio
const TEXTO_ENTIDAD = new Map([
    ['aplicacion', 'Aplicación'],
    ['aprobacion', 'Aprobación'],
    ['area', 'Gerencia o área'],
    ['categoria_deuda', 'Categoría de deuda'],
    ['comentario', 'Comentario'],
    ['criticidad', 'Criticidad'],
    ['elemento', 'Elemento'],
    ['equipo_miembro', 'Miembro de equipo'],
    ['equipo_tecnico', 'Equipo técnico'],
    ['evidencia', 'Evidencia'],
    ['origen', 'Origen'],
    ['parametro', 'Parámetro'],
    ['plan_accion', 'Plan de acción'],
    ['prorroga', 'Prórroga'],
    ['rol', 'Rol'],
    ['rol_permiso', 'Permisos del rol'],
    ['tarea', 'Tarea'],
    ['usuario', 'Usuario'],
])

const primeraEnMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

// 'responsableNombre' y 'equipo_retirado' pasan a "Responsable nombre" y "Equipo retirado"
export const legible = (clave: string) =>
    primeraEnMayuscula(
        clave
            .replace(/_/g, ' ')
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            .toLowerCase(),
    )

const tipoGuardado = (valor: ValorBitacora | undefined) =>
    valor !== null && valor !== undefined && !Array.isArray(valor) ? valor.tipo : undefined

// Una entidad que la tabla no conoce (una nueva del backend) se muestra legible, sin romper. Gerencias y areas se
// guardan en la misma entidad: con el registro, su tipo (el del valor nuevo o, si falta, el del anterior) dice cual es;
// los cambios de estado antiguos no lo guardaban y, sin registro (el filtro), se dice "Gerencia o área"
export const textoEntidad = (entidad: string, registro?: Pick<RegistroBitacora, 'valorAnterior' | 'valorNuevo'>) => {
    if (entidad === 'area') {
        const tipo = tipoGuardado(registro?.valorNuevo) ?? tipoGuardado(registro?.valorAnterior)
        return tipo === 'GERENCIA' ? 'Gerencia' : tipo === 'AREA' ? 'Área' : 'Gerencia o área'
    }
    return TEXTO_ENTIDAD.get(entidad) ?? legible(entidad)
}

export const TEXTOS = {
    titulo: 'Bitácora',
    descripcion: 'Registro de los cambios hechos en el sistema.',
    sinRegistros: 'No hay registros con estos filtros',
    sinCambios: 'Este registro no guardó valores.',
    soloIguales: 'Ningún valor cambió.',
    descripcionCambio: 'Detalle de un cambio registrado.',
    porDefecto: '—',
}
