import type { BadgeStatus } from '@hnba/react-ui'
import { formatearFecha } from '../../utils/formato'
import { nombreAccion, nombreRecurso } from '../roles/permisosRol'
import { legible, TEXTOS } from './textos'

export type TipoCambio = 'AGREGADO' | 'QUITADO' | 'MODIFICADO' | 'IGUAL'

export interface FilaCambio {
    clave: string
    campo: string
    antes: string
    despues: string
    tipo: TipoCambio
}

export const TIPO_CAMBIO: Record<TipoCambio, { texto: string; estado: BadgeStatus }> = {
    AGREGADO: { texto: 'Agregado', estado: 'success' },
    QUITADO: { texto: 'Quitado', estado: 'error' },
    MODIFICADO: { texto: 'Modificado', estado: 'warning' },
    IGUAL: { texto: 'Sin cambio', estado: 'neutral' },
}

type Objeto = Record<string, unknown>

// Como guarda la bitacora los permisos de un rol: [{ codigo: 'PLAN:LEER', alcance: 'TODO' }]
interface PermisoGuardado {
    codigo: string
    alcance: string
}

const TEXTO_ALCANCE = new Map([
    ['TODO', 'Todo'],
    ['PROPIO', 'Solo lo propio'],
])

const esObjeto = (valor: unknown): valor is Objeto =>
    typeof valor === 'object' && valor !== null && !Array.isArray(valor)

const esVacio = (valor: unknown) => valor === null || valor === undefined || valor === ''

const esPermiso = (valor: unknown): valor is PermisoGuardado =>
    esObjeto(valor) && typeof valor.codigo === 'string' && typeof valor.alcance === 'string'

const sonPermisos = (valor: unknown): valor is PermisoGuardado[] =>
    Array.isArray(valor) && valor.length > 0 && valor.every(esPermiso)

// Un lado con permisos y el otro tambien, vacio o sin guardar
const esListaDePermisos = (antes: unknown, despues: unknown) => {
    const sinPermisos = (valor: unknown) => esVacio(valor) || (Array.isArray(valor) && valor.length === 0)
    return (
        (sonPermisos(antes) && (sonPermisos(despues) || sinPermisos(despues))) ||
        (sonPermisos(despues) && sinPermisos(antes))
    )
}

// 'PLAN:LEER' pasa a "Plan · Leer"
const textoPermiso = (codigo: string) => {
    const [recurso, accion] = codigo.split(':')
    return accion ? `${nombreRecurso(recurso)} · ${nombreAccion(accion)}` : codigo
}

const mostrar = (valor: unknown): string => {
    if (esVacio(valor)) {
        return TEXTOS.porDefecto
    }
    if (typeof valor === 'boolean') {
        return valor ? 'Sí' : 'No'
    }
    if (Array.isArray(valor)) {
        return valor.length === 0 ? TEXTOS.porDefecto : valor.map(mostrar).join(', ')
    }
    if (esObjeto(valor)) {
        return Object.entries(valor)
            .map(([campo, interno]) => `${legible(campo)}: ${mostrar(interno)}`)
            .join(' · ')
    }
    const texto = String(valor)
    return /^\d{4}-\d{2}-\d{2}$/.test(texto) ? formatearFecha(texto) : texto
}

const fila = (clave: string, campo: string, antes: unknown, despues: unknown, aTexto = mostrar): FilaCambio => {
    const textos = { antes: aTexto(antes), despues: aTexto(despues) }
    const tipo: TipoCambio =
        textos.antes === textos.despues
            ? 'IGUAL'
            : textos.antes === TEXTOS.porDefecto
              ? 'AGREGADO'
              : textos.despues === TEXTOS.porDefecto
                ? 'QUITADO'
                : 'MODIFICADO'
    return { clave, campo, ...textos, tipo }
}

const textoAlcance = (alcance: unknown) =>
    esVacio(alcance) ? TEXTOS.porDefecto : (TEXTO_ALCANCE.get(String(alcance)) ?? String(alcance))

// Los permisos se comparan por su codigo, no por su posicion en la lista: quitar uno no mueve a los demas
const filasDePermisos = (antes: unknown, despues: unknown): FilaCambio[] => {
    const alcances = (valor: unknown) =>
        new Map(sonPermisos(valor) ? valor.map(({ codigo, alcance }) => [codigo, alcance]) : [])
    const anteriores = alcances(antes)
    const nuevos = alcances(despues)
    return [...new Set([...anteriores.keys(), ...nuevos.keys()])].map((codigo) =>
        fila(codigo, textoPermiso(codigo), anteriores.get(codigo), nuevos.get(codigo), textoAlcance),
    )
}

// Las filas de antes y despues. Un objeto dentro de otro se abre en sus campos ("Rol · Nombre")
export const cambiosDe = (antes: unknown, despues: unknown, campos: string[] = []): FilaCambio[] => {
    if (esListaDePermisos(antes, despues)) {
        return filasDePermisos(antes, despues)
    }
    const comoObjeto = (valor: unknown) => esObjeto(valor) || esVacio(valor)
    if ((esObjeto(antes) || esObjeto(despues)) && comoObjeto(antes) && comoObjeto(despues)) {
        const anterior = esObjeto(antes) ? antes : {}
        const nuevo = esObjeto(despues) ? despues : {}
        return [...new Set([...Object.keys(anterior), ...Object.keys(nuevo)])].flatMap((campo) =>
            cambiosDe(anterior[campo], nuevo[campo], [...campos, campo]),
        )
    }
    if (campos.length === 0 && esVacio(antes) && esVacio(despues)) {
        return []
    }
    return [fila(campos.join('.'), campos.map(legible).join(' · ') || 'Valor', antes, despues)]
}
