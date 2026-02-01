# Event SPA (Vanilla JS + Vite + json-server)

Sistema de Gestión de Eventos en arquitectura SPA usando HashRouter, autenticación con roles y persistencia de sesión en LocalStorage.

## Funcionalidades
- Registro y login de usuarios (rol `admin` o `visitor`).
- Persistencia de sesión con LocalStorage.
- Rutas protegidas:
  - Cualquier usuario autenticado: listado y detalle de eventos.
  - Solo admin: CRUD de eventos.
- Registro de asistentes a eventos (solo visitor):
  - Valida cupos máximos (`attendees.length < capacity`)
  - Evita registros duplicados
  - Permite cancelar registro
- Consumo de API con Fetch + manejo de errores.

## Requisitos
- Node.js 18+
- json-server

## Instalación
```bash
npm install