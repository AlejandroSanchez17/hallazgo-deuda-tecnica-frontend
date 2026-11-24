# Separar hallazgos y deuda técnica en dos pantallas — Plan de implementación

> **Para quien ejecute:** usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans. Los pasos usan casillas `- [ ]`.

**Meta:** que "Hallazgos" y "Deuda técnica" sean dos listas distintas bajo un solo grupo del menú, cada una con su botón de registrar que ya fija el tipo.

**Arquitectura:** todo queda dentro de `modules/elementos`. `ElementosPage` y `ElementoForm` reciben el tipo como parámetro opcional. Sin tipo se comportan como hoy, y esa versión sin tipo sigue siendo la lista combinada en `/elementos`. El detalle y el plan de acción se mantienen compartidos en `/elementos/:id`.

**Tecnología:** React, react-router-dom, `@hnba/react-ui`, `@hnba/design-tokens`. Sin Tailwind ni componentes propios de UI.

**Spec:** acordado en la conversación del 2026-11-20 (no hay documento aparte).

## Restricciones globales
- Todo texto visible, nombres de negocio y comentarios en español; inglés solo en lo técnico.
- Un módulo no importa de otro. `utils/constants` no importa de `modules`: el tipo se declara en línea como `'HALLAZGO' | 'DEUDA'`.
- Permisos sin cambios: `ELEMENTO:LEER`, `ELEMENTO:CREAR`, `ELEMENTO:ACTUALIZAR`.
- Las dos tablas llevan las mismas columnas que la actual. Tipo se oculta en las listas por tipo porque todas sus filas valen lo mismo (decisión mía, fácil de revertir).
- El proyecto no tiene pruebas automáticas. Se verifica con `npm run build`, `npm run lint` y el navegador. No se hacen commits hasta que el usuario lo pida.

## Revisión (casos que ninguna tarea prueba por sí sola)
- Abrir `/hallazgos?tipo=DEUDA` a mano: el tipo de la URL se ignora y solo salen hallazgos.
- Un usuario con alcance PROPIO que no tiene hallazgos: la lista muestra el texto vacío del tipo.
- Recargar el navegador en `/elementos/5`: el grupo del menú sale desplegado.
- Detalle de un elemento que no existe: el botón Volver sigue llevando a `/elementos`.
- Los enlaces del Tablero (mezclan tipos, solo traen semáforo y equipo) siguen llegando a `/elementos` con sus filtros.

---

### Tarea 1: Rutas, menú, migas y registro de rutas

**Archivos:**
- Modificar: `src/utils/constants/rutas.ts`, `menu.ts`, `migas.ts`
- Modificar: `src/config/routes.tsx`
- Modificar: `src/components/common/Sidebar/Sidebar.tsx`

**Interfaces:**
- Produce: `RUTAS.hallazgos = '/hallazgos'`, `RUTAS.deudaTecnica = '/deuda-tecnica'`, `RUTAS.hallazgosYDeuda = '/hallazgos-y-deuda'` (solo identifica el grupo, no es pantalla).
- Produce: `rutaListaDe(tipo: 'HALLAZGO' | 'DEUDA'): string` en `rutas.ts`.
- Consume (Tarea 2): `<ElementosPage tipo?: TipoElemento />`.

- [ ] **Paso 1:** en `rutas.ts` agregar las tres constantes y `rutaListaDe`. `RUTAS.elementos` se conserva (lista combinada, detalle y plan).
- [ ] **Paso 2:** en `menu.ts` reemplazar la opción "Hallazgos y deuda" por un grupo `{ ruta: RUTAS.hallazgosYDeuda, texto: 'Hallazgos y deuda', permiso: PERMISOS.elementoLeer, hijos: [...] }` con los hijos "Hallazgos" (`RUTAS.hallazgos`) y "Deuda técnica" (`RUTAS.deudaTecnica`), cada uno con `permiso: PERMISOS.elementoLeer`. Agregar al tipo `OpcionMenu` el campo opcional `incluye?: string[]` y ponerle `[RUTAS.elementos]` al grupo.
- [ ] **Paso 3:** en `Sidebar.tsx` cambiar el icono de `RUTAS.elementos` a `RUTAS.hallazgosYDeuda` (`'clipboard_list'`). En `gruposDe`, un grupo también cuenta como "contiene la pantalla actual" si `pathname` empieza por alguna ruta de `incluye`; así `/elementos/5` deja el grupo desplegado.
- [ ] **Paso 4:** en `migas.ts` agregar `[RUTAS.hallazgos]: [inicio, { texto: 'Hallazgos y deuda' }, { texto: 'Hallazgos' }]` y `[RUTAS.deudaTecnica]: [inicio, { texto: 'Hallazgos y deuda' }, { texto: 'Deuda técnica' }]`. Las migas de `/elementos`, del detalle y del plan no cambian.
- [ ] **Paso 5:** en `routes.tsx` agregar, junto a la ruta de `RUTAS.elementos`, dos rutas hermanas protegidas con `PERMISOS.elementoLeer`: `RUTAS.hallazgos` → `<ElementosPage tipo="HALLAZGO" />` y `RUTAS.deudaTecnica` → `<ElementosPage tipo="DEUDA" />`.
- [ ] **Paso 6:** verificar con `npm run build`. Esperado: sin errores de tipos (cuando termine también la Tarea 2).

### Tarea 2: Lista y formulario por tipo

**Archivos:**
- Modificar: `src/modules/elementos/pages/ElementosPage/ElementosPage.tsx`
- Modificar: `src/modules/elementos/components/BarraElementos/BarraElementos.tsx`
- Modificar: `src/modules/elementos/components/ElementoForm/ElementoForm.tsx`
- Modificar: `src/modules/elementos/hooks/useElementoForm.ts`, `solicitud.ts`, `textos.ts`

**Interfaces:**
- Produce: `ElementosPage({ tipo }: { tipo?: TipoElemento })`.
- Produce: `ElementoForm({ ficha, tipo?, onCerrar, onGuardado })`; `tipo` solo se usa cuando `ficha` es `null`.
- Produce: `useElementoForm(ficha, onGuardado, tipo?: TipoElemento)` y `formularioInicial(ficha, tipo?: TipoElemento)`; el tipo del formulario es `ficha?.tipo ?? tipo ?? ''`.
- Produce: `TEXTOS_LISTA: Record<TipoElemento, { titulo; descripcion; botonNuevo; tituloNuevo; textoVacio }>` en `textos.ts`.
  - Hallazgos: "Hallazgos", "Nuevo hallazgo", vacío "No hay hallazgos registrados".
  - Deuda: "Deuda técnica", "Nueva deuda técnica", vacío "No hay deuda técnica registrada".
- Produce: `BarraElementos` con prop opcional `ocultarTipo?: boolean`.

- [ ] **Paso 1:** en `solicitud.ts` y `useElementoForm.ts`, aceptar el tipo inicial como se indica arriba.
- [ ] **Paso 2:** en `ElementoForm.tsx`, con `tipo` recibido y `esNuevo`, no dibujar el campo Tipo y poner el título `TEXTOS_LISTA[tipo].tituloNuevo`. Sin `tipo`, el formulario queda como hoy ("Nuevo elemento" con combo de Tipo).
- [ ] **Paso 3:** en `BarraElementos.tsx`, con `ocultarTipo` no dibujar el filtro `tipo`.
- [ ] **Paso 4:** en `ElementosPage.tsx`:
  - Filtrar `registros` por `tipo` antes de calcular filas y `opcionesDeFiltro`.
  - Con `tipo`, forzar `filtros.tipo = ''` e ignorar el `tipo` de la URL.
  - Ocultar la columna Tipo cuando hay `tipo`.
  - Título, descripción, botón y texto vacío salen de `TEXTOS_LISTA[tipo]`; sin tipo se queda el texto actual.
  - Pasar `tipo` a `<ElementoForm>` y a `BarraElementos` (`ocultarTipo`).
- [ ] **Paso 5:** `npm run build` y `npm run lint`. Esperado: sin errores nuevos.

### Tarea 3: Volver en el detalle y comprobación en el navegador

**Archivos:**
- Modificar: `src/modules/elementos/pages/ElementoDetallePage/ElementoDetallePage.tsx:80-84`

- [ ] **Paso 1:** el botón Volver navega a `rutaListaDe(ficha.tipo)` cuando `ficha` existe, y a `RUTAS.elementos` si no. El texto pasa a "Volver a hallazgos" o "Volver a deuda técnica" según el tipo, y queda "Volver a hallazgos y deuda" sin ficha.
- [ ] **Paso 2:** con `npm run dev`, comprobar en el navegador:
  - El menú muestra el grupo con dos hijos.
  - `/hallazgos` y `/deuda-tecnica` listan solo su tipo y no tienen filtro "Todo tipo".
  - "Nuevo hallazgo" abre el formulario con solo los campos de hallazgo, y "Nueva deuda técnica" solo los de deuda.
  - Editar y Ver funcionan igual.
  - El Volver del detalle va a la lista del tipo.
  - Un enlace del Tablero llega a `/elementos` con sus filtros.
  - Consola sin errores.
- [ ] **Paso 3:** reportar lo que se comprobó y lo que no.

---

## Revisión contra el diseño
- Rutas, menú agrupado, migas, icono → Tarea 1.
- Página y formulario por tipo, sin filtro de tipo, botones propios → Tarea 2.
- Volver al listado del tipo → Tarea 3.
- Enlaces del Tablero: ninguno trae tipo (solo semáforo y equipo), así que todos siguen en `/elementos`. No hay nada que cambiar en `modules/tablero`.
