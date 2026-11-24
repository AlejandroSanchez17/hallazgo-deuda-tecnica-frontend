# Guía: el proceso completo de un hallazgo y de una deuda técnica

Ejemplo para recorrer el sistema de punta a punta con la base limpia: roles, usuarios, equipo, un hallazgo y una deuda técnica, hasta su cierre. Los nombres y fechas son de ejemplo (hoy es 21/11/2026): cámbielos si quiere, pero respete las reglas que se anotan.

## 0. Dejar la base lista

1. Detenga el backend.
2. Ejecute el script (pide confirmación, hace un respaldo y le pregunta los datos de Darwin):

   ```powershell
   cd C:\Users\dsd21\OneDrive\Escritorio\Hallazgos_Deuda_Tecnica
   powershell -ExecutionPolicy Bypass -File .\reiniciar_base_con_administrador.ps1
   ```

   Sin `-Base` usa `db_hallazgo_deuda_tecnica`. Para `Base prueba`: `-Base "Base prueba"`.
3. El administrador queda con `id_usuario = 1`. En el frontend, en `.env.development`, ponga `VITE_USUARIO_SIMULADO_ID=1` y, si la ventana del navegador tenía otro usuario guardado, elija a Darwin en el selector del encabezado.
4. Arranque el backend (con `DB_NAME` si la base no es la real) y el frontend.

Qué queda: 1 usuario (Darwin Sanchez), 1 rol (Administrador, con sus 24 permisos), los 39 permisos del sistema, los catálogos del script 03 (áreas, orígenes, categorías de deuda y las cuatro criticidades) y los parámetros. Las criticidades y el parámetro de quién valida los hallazgos quedan apuntando al Administrador: se corrigen en los pasos 2 y 3.

Todo lo que sigue se hace **cambiando de usuario con el selector del encabezado** (aún no hay inicio de sesión).

## 1. Roles (Administración › Roles y permisos › Roles) — como Darwin

Cree cinco roles con **Nuevo rol** y luego, en la pestaña **Permisos**, marque los de cada uno. "Propio" es el interruptor de la fila: el equipo o las tareas del usuario; apagado es todo.

| Rol | Descripción | Global | Permisos (alcance) |
|---|---|---|---|
| **Gerencia de TI** | Consulta todo; aprueba planes, prórrogas y cierres de criticidad crítica y alta | Sí | Todo en TODO: Catálogo Leer · Parámetro Leer · Usuario Leer · Equipo Leer · Elemento Leer · Deuda restringida Leer · Plan Leer y Aprobar · Tarea Leer · Evidencia Leer y Descargar · Prórroga Leer y Aprobar · Cierre Leer y Validar · Reporte Leer · Bitácora Leer · Notificación Resumen semanal |
| **Registrador** | Registra hallazgos y deuda; aprueba planes y cierres de criticidad media y baja | No | Todo en TODO: Catálogo Leer · Parámetro Leer · Equipo Leer · Elemento Crear, Leer, Actualizar y Desactivar · Deuda restringida Leer · Plan Leer y Aprobar · Tarea Leer · Evidencia Leer y Descargar · Prórroga Leer · Cierre Leer y Validar · Reporte Leer |
| **Líder técnico** | Elabora el plan, asigna tareas, pide prórrogas y cierre | No | Catálogo Leer y Parámetro Leer en TODO; el resto con **Propio**: Equipo Leer, Actualizar, **Liderar** y **Participar** · Elemento Leer y Actualizar · Deuda restringida Leer · Plan Crear, Leer, Actualizar y Solicitar · Tarea Crear, Leer, Actualizar y Desactivar · Evidencia Crear, Leer y Descargar · Prórroga Leer y Solicitar · Cierre Leer y Solicitar · Reporte Leer |
| **Miembro de equipo** | Ejecuta tareas, registra avance y sube evidencias | No | Catálogo Leer y Parámetro Leer en TODO; el resto con **Propio**: Equipo Leer y **Participar** · Elemento Leer · Deuda restringida Leer · Plan Leer · Tarea Leer y Actualizar · Evidencia Crear, Leer y Descargar · Reporte Leer |
| **Auditor** | Consulta todo, evidencias y reportes; valida el cierre de los hallazgos | Sí | Todo en TODO: Catálogo Leer · Parámetro Leer · Equipo Leer · Elemento Leer · Deuda restringida Leer · Plan Leer · Tarea Leer · Evidencia Leer y Descargar · Prórroga Leer · Cierre Leer y Validar · Reporte Leer · Bitácora Leer |

Para ser **líder** de un equipo hace falta el permiso Equipo › Liderar, y para ser **miembro**, Equipo › Participar. Sin ellos el usuario no aparece al armar el equipo.

## 2. Quién aprueba y valida (como Darwin)

- **Catálogos › Criticidades**, edite cada una:

  | Criticidad | Plazo | Aprueba el plan | Valida el cierre (deuda) |
  |---|---|---|---|
  | Crítica | 3 meses | Gerencia de TI | Gerencia de TI |
  | Alta | 6 meses | Gerencia de TI | Gerencia de TI |
  | Media | 9 meses | Registrador | Registrador |
  | Baja | 12 meses | Registrador | Registrador |

- **Administración › Parámetros**: `rol_valida_cierre_hallazgo` = **Auditor** (el cierre de un hallazgo lo valida ese rol; el de una deuda, el de su criticidad).

## 3. Catálogo de aplicaciones (como Darwin)

**Catálogos › Aplicaciones**: cree `Core Bancario` y `Banca en Línea`. (Áreas, orígenes y categorías ya vienen del script 03.)

## 4. Usuarios (Administración › Usuarios) — como Darwin

Use correos de ejemplo (`@example.com`): hoy no se envían correos reales.

| Nombre | Correo | Usuario de red | Rol |
|---|---|---|---|
| Carolina Mejía | cmejia@example.com | cmejia | Gerencia de TI |
| Roberto Medina | rmedina@example.com | rmedina | Registrador |
| Ana Salgado | asalgado@example.com | asalgado | Auditor |
| Lucía López | llopez@example.com | llopez | Líder técnico |
| Mateo Rojas | mrojas@example.com | mrojas | Miembro de equipo |
| María Fernández | mfernandez@example.com | mfernandez | Miembro de equipo |

## 5. Equipo (Administración › Equipos técnicos) — como Darwin

1. **Nuevo equipo**: nombre `Equipo Core Bancario`, área `Desarrollo de Software`, líder `Lucía López`, descripción "Mantiene el core bancario".
2. En su detalle, **Agregar miembro**: Mateo Rojas y María Fernández (sin fecha: se usa la de hoy).

Un usuario solo puede estar en un equipo vigente a la vez.

## 6. El hallazgo, de punta a punta

**6.1 Registrarlo — Roberto Medina (Registrador).** Hallazgos y deuda › Hallazgos › **Nuevo hallazgo**:

| Campo | Valor |
|---|---|
| Origen | Auditoría interna |
| Título | Cuentas privilegiadas sin revisión periódica en el core |
| Descripción | Se encontraron 14 cuentas con privilegios de administrador sin revisión en los últimos 12 meses |
| Criticidad · Equipo | Alta · Equipo Core Bancario |
| Aplicaciones | Core Bancario |
| Fecha de identificación | 20/11/2026 |
| Fecha compromiso | la sugerida (20/05/2027, plazo de 6 meses) |
| Referencia del informe · Ente emisor | INF-AI-2026-014 · Auditoría Interna |
| Recomendación | Revisar trimestralmente las cuentas privilegiadas y retirar las que no se usan |
| Riesgo asociado | Acceso indebido a información de clientes |

Pide confirmar las fechas (después no se cambian). Queda en estado **Registrado** y con código `HA-2026-0001`.

**6.2 El plan — Lucía López (Líder técnico).** Abra el hallazgo › **Plan de acción** › **Crear plan**:

| Campo | Valor |
|---|---|
| Objetivo | Tener las cuentas privilegiadas revisadas y un control trimestral permanente |
| Estrategia | Inventariar, depurar y dejar un procedimiento con responsables |
| Inicio · Compromiso | hoy · 30/04/2027 (no puede pasar del compromiso del hallazgo) |

Cree tres tareas con **Nueva tarea**; los pesos suman 100:

| Título | Responsable | Inicio – Fin | Peso | Depende de |
|---|---|---|---|---|
| Inventariar las cuentas privilegiadas del core | Mateo Rojas | 23/11/2026 – 18/12/2026 | 20 | — |
| Implementar la revisión trimestral de accesos | María Fernández | 04/01/2027 – 26/02/2027 | 50 | la 1 |
| Documentar el procedimiento y capacitar al equipo | Lucía López | 01/03/2027 – 30/04/2027 | 30 | la 2 |

Con la suma en "100 de 100" y sin avisos rojos, **Enviar a aprobación**. El hallazgo pasa a **Plan en aprobación**.

**6.3 Aprobar el plan — Carolina Mejía (Gerencia de TI)**, porque la criticidad es Alta. Aprobaciones › el plan › **Aprobar**. El hallazgo pasa a **En ejecución**.
(Para ver una devolución: **Devolver** con una observación; Lucía lo corrige y lo envía de nuevo.)

**6.4 Ejecutar — Mateo, María y Lucía.** Cada uno entra a **Mis tareas** (la 3 la ve Lucía) y usa **Avance**:

- Mateo, tarea 1: En progreso 40 % ("Inventario a medias"), luego **Finalizada** 100 %.
- Una tarea que depende de otra no avanza hasta que la anterior esté Finalizada.
- Para Finalizar hace falta una **evidencia vigente** de la tarea (el plan la exige): en la tarea › Evidencias, suba un PDF real (por ejemplo `inventario_cuentas.pdf`) o un enlace `https://example.com/inventario`, con una descripción.
- Después, María (tarea 2) y Lucía (tarea 3) hacen lo mismo. Se ve cómo sube el avance del plan.

**6.5 Pedir el cierre — Lucía López.** Cuando las tres estén Finalizadas con evidencia: en el hallazgo, pestaña **Cierre** › **Solicitar cierre**. Estado: **Cierre solicitado**. Si falta algo, el sistema lista exactamente qué.

**6.6 Validar el cierre — Ana Salgado (Auditor)**, porque es un hallazgo. Aprobaciones › **Aprobar** (o **Rechazar** con comentario: vuelve a En ejecución). Estado final: **Cerrado**.

## 7. La deuda técnica, de punta a punta

**7.1 Registrarla — Roberto Medina.** Hallazgos y deuda › Deuda técnica › **Nueva deuda técnica**:

| Campo | Valor |
|---|---|
| Origen | Revisión de código |
| Título | Actualizar las librerías de acceso a datos del core |
| Descripción | Las librerías de acceso a datos están sin soporte del fabricante y bloquean la actualización del servidor |
| Criticidad · Equipo | Media · Equipo Core Bancario |
| Aplicaciones | Core Bancario |
| Fechas | identificación 20/11/2026 · compromiso sugerido (20/08/2027, 9 meses) |
| Categoría · Componente | Dependencias · Módulo de acceso a datos |
| Esfuerzo | 60 horas, talla L (con las dos, cuentan las horas) |
| Causa | Se pospuso la actualización por prioridades de negocio |
| Impacto técnico | No se puede actualizar el servidor de aplicaciones |
| Impacto en el negocio | Riesgo de vulnerabilidades sin parche |

Código `DT-2026-0001`. (Para ver una categoría restringida, use *Seguridad*: solo la ven los roles con "Deuda restringida Leer".)

**7.2 El plan — Lucía López.** Objetivo "Actualizar y probar las librerías", estrategia "Actualizar por módulos con pruebas de regresión", inicio hoy y compromiso 30/06/2027. Dos tareas:

| Título | Responsable | Inicio – Fin | Peso |
|---|---|---|---|
| Actualizar las librerías y corregir incompatibilidades | Mateo Rojas | 23/11/2026 – 26/03/2027 | 60 |
| Ejecutar pruebas de regresión y publicar | María Fernández | 29/03/2027 – 30/06/2027 | 40 |

**Enviar a aprobación.**

**7.3 Aprobar el plan — Roberto Medina (Registrador)**, porque la criticidad es Media.

**7.4 Una prórroga (opcional pero útil) — Lucía y Carolina.** En la pestaña **Prórrogas** del elemento, Lucía pide la prórroga: fecha propuesta `30/09/2027`, justificación "Depende de la ventana de cambios del banco". La resuelve **Carolina Mejía (Gerencia de TI)**, que tiene "Prórroga Aprobar": **Aprobar** (la fecha vigente cambia; la original queda) o **Rechazar** con comentario. Con el máximo de la criticidad ya usado, la siguiente es "adicional".

**7.5 Ejecutar, pedir el cierre y validar.** Igual que el hallazgo, pero la valida **Roberto Medina (Registrador)**, porque el cierre de una deuda lo valida el rol de su criticidad (Media).

## 8. Qué mirar al terminar

- **Carolina Mejía (Gerencia):** el **Tablero** (abiertos, cerrados del período, cumplimiento, tiempo de cierre, deuda pendiente en horas) y **Reportes** (por ejemplo REP-01 y REP-02, y REP-10 en PDF del mes). También la **Bitácora**.
- **Ana Salgado (Auditor):** Reportes y Bitácora; en el elemento cerrado, Evidencias › **Descargar todo** (ZIP con `indice.csv`).
- **Lucía López:** Reportes (solo su equipo) y el botón **Reporte del plan** en la ficha del elemento.
- **Todos:** la campana de notificaciones muestra lo que les tocó (plan enviado, aprobado, cierre solicitado…).

## 9. Si algo no sale

| Síntoma | Causa y solución |
|---|---|
| Lucía no aparece como líder al crear el equipo | Falta el permiso Equipo › Liderar en su rol |
| Mateo o María no aparecen al agregar miembros | Falta Equipo › Participar, o ya están en otro equipo |
| "El plan no se puede enviar a aprobación" | Los pesos no suman 100, una tarea termina después del compromiso del plan o no hay tareas: el aviso rojo lo explica |
| Nadie ve el botón Aprobar | El rol de la criticidad no es el del usuario (paso 2), o a ese rol le falta Plan › Aprobar |
| "Falta una evidencia" al finalizar | La tarea no tiene una evidencia vigente (paso 6.4) |
| El cierre del hallazgo lo ve el Administrador | El parámetro `rol_valida_cierre_hallazgo` sigue en Administrador (paso 2) |
| 401 al abrir el sistema | El usuario guardado en el navegador ya no existe: elíjalo de nuevo o cierre sesión (`VITE_USUARIO_SIMULADO_ID=1`) |
