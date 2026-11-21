# FE-15 Pantalla de reportes (HDT-48) — diseño breve

Aprobado por el usuario el 21/11/2026.

## Intención
Elegir un reporte, ajustar sus filtros y descargarlo en Excel o PDF (`GET /api/reportes/{codigo}?formato=xlsx|pdf&...`, permiso `REPORTE:LEER`). Lo ven todos los roles con el permiso y cualquier alcance (también Líder y Miembro, que solo ven sus equipos). HU-08: el Excel respeta los filtros aplicados en pantalla.

## No objetivos
Previsualizar el contenido del reporte; cambiar el backend; tocar el tablero.

## Enfoques considerados
1. **Pantalla `/reportes` con accesos directos que navegan a ella** (elegido): la ficha del elemento y la bandeja abren `/reportes` con el reporte y los filtros ya puestos. Un clic más, pero `elementos` no copia la lógica de descarga.
2. Descarga directa desde la ficha y la bandeja: un clic menos, pero duplica la lógica de descarga en `elementos` (descartado por el usuario a favor de 1).

## Diseño
- **Módulo nuevo `modules/reportes`** (independiente: su `api`, `types`, `textos`, hooks y combos; no importa de otros módulos). Compartidos fuera de módulos: `utils/descarga.ts`, `services/api`, `components/common/Pantalla`.
- **Ruta y menú:** `RUTAS.reportes = '/reportes'`, `RutaProtegida permiso={reporteLeer}` (sin `alcance`), opción "Reportes" en `menu.ts` con `REPORTE:LEER`, miga Inicio › Reportes.
- **API:** `api.get(blob)` con `params`, `responseType: 'blob'`, timeout largo; nombre de archivo con `nombreDeDescarga(content-disposition, respaldo)`. Los errores en blob ya los convierte el interceptor.
- **Pantalla:** `Select` de reporte (REP-01…REP-08 y REP-10) con descripción del elegido; filtros que ese reporte usa según una tabla de configuración por código (ocultar período en REP-03/07/08, `tipo` en REP-01/02); botones Excel y PDF.
  - REP-10: solo PDF (Excel deshabilitado), selector de mes que manda `desde`/`hasta`.
  - REP-05: pide `elementoId` (combo de elementos con código y título) e ignora los demás filtros.
- **Filtros en la URL:** `?reporte=REP-03&equipo=6&desde=…`; lo que se manda al backend sale de ahí tal cual.
- **Combos:** criticidad, origen, área, aplicación y equipo desde catálogos y `/equipos` (con alcance propio solo vienen los del usuario); **líder** sale del líder de cada equipo de `/equipos`, porque Líder y Miembro no tienen `USUARIO:LEER`. Elementos para REP-05 desde `/elementos`.
- **Errores:** 422 marca su campo (`hasta`, `formato`, `elementoId`); 400, 403, 404 y 500 salen como aviso o `Alert` con el `mensaje` del backend.
- **Accesos directos:** botón "Reporte del plan" en la ficha del elemento (→ `/reportes?reporte=REP-05&elementoId=N`) y "Exportar vencidos (Excel)" en la bandeja (→ REP-03 con sus filtros: tipo, estado, criticidad, equipo, origen). Solo comparten la ruta (constante en `utils/constants/rutas.ts`).

## Lo que queda al constructor
Orden y anchos de los filtros, textos, validación local del período, y el aspecto del selector de mes, siguiendo el patrón de pantallas del proyecto (solo `@hnba/react-ui` y tokens).
