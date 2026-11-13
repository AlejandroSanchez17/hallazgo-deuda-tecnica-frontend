# Frontend del Sistema de Hallazgos y Deuda Técnica

React 19, TypeScript, Vite, React Router, Zustand, axios y la librería de componentes de la empresa (`@hnba/react-ui` y `@hnba/design-tokens`).

## Arrancar

1. En un equipo nuevo, autentica contra el feed privado de la librería: `npx vsts-npm-auth -config .npmrc`. Necesitas permiso de lectura sobre el proyecto `HN-BASA/IT-INN-J2C` de Azure DevOps; sin él, `npm install` responde 401.
2. `npm install`
3. Arranca el backend en `http://localhost:8080`.
4. `npm run dev` y abre `http://localhost:5173`. El puerto es fijo porque el backend solo acepta CORS desde él. Si cambias las dependencias con el servidor encendido, reinícialo.

Las variables están en `.env.development`:

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | URL del backend |
| `VITE_USUARIO_SIMULADO_ID` | Usuario que se envía en `X-Usuario-Id` hasta tener el login (FE-02); se cambia desde el menú del usuario en la barra superior |

Para cambiar un valor solo en tu equipo, cópialo en `.env.development.local`, que git no sube.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Revisa los tipos y genera `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Formatea con Prettier |
| `npm run format:check` | Revisa el formato sin cambiar nada |

## Reglas

- La interfaz se arma solo con componentes de `@hnba/react-ui`. No se usa Tailwind, SweetAlert ni componentes propios equivalentes a los de la librería.
- Los colores, la tipografía, el espaciado y los radios salen de `@hnba/design-tokens`. La disposición (flex, separaciones) se hace con la prop `style` y los helpers de `src/styles/disposicion.ts`.
- Los avisos usan `useToast` y las confirmaciones `ConfirmDialog`, a través de `src/utils/alertas.ts`.
- Los formularios se abren como panel por el lado derecho (`FormModal`).
- `@hnba/react-ui` y `@hnba/design-tokens` se actualizan siempre juntos.
- El detalle de la estructura y las convenciones está en `FICHA_TECNICA_FRONTEND.md`.
