// Lo que necesita cualquier modulo para nombrar una gerencia, un area o una subarea (GET /catalogos/areas)
export interface AreaJerarquia {
    id: number
    nombre: string
    tipo: 'GERENCIA' | 'AREA'
    areaPadreId: number | null
    areaPadreNombre: string | null
    // Calculada por el backend; nula en una gerencia y en un area antigua sin gerencia
    gerenciaId: number | null
}

// Su area superior: solo una subarea (o un area antigua colgada de otra area) tiene; si el padre es la gerencia, no
export const areaSuperiorDe = (area: AreaJerarquia): string | null =>
    area.areaPadreId !== null && area.areaPadreId !== area.gerenciaId ? area.areaPadreNombre : null

// "Area › Subarea" para una subarea; en cualquier otro caso, su nombre
export const textoArea = (area: AreaJerarquia): string => {
    const superior = area.tipo === 'AREA' && area.gerenciaId !== null ? areaSuperiorDe(area) : null
    return superior === null ? area.nombre : `${superior} › ${area.nombre}`
}
