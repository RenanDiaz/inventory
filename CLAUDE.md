You are a senior full-stack TypeScript architect.

Generate a production-ready MVP codebase for a mobile-first offline-first inventory web application.

The project must be clean, modular, scalable, but intentionally simple (no over-engineering).

⸻

🎯 PROJECT GOAL

Build an offline-first inventory and sales PWA for small stores (1–5 users), supporting:
	•	Products
	•	Inventory movements
	•	Sales
	•	Consignments
	•	Bilingual support (English / Spanish)
	•	Full offline capability
	•	Synchronization with Supabase
	•	Stock stored and updated transactionally

The system must work 100% offline and sync automatically when connection is restored.

⸻

🏗️ TECH STACK

Frontend:
	•	React 18
	•	TypeScript
	•	Vite
	•	TailwindCSS
	•	Dexie (IndexedDB)
	•	Zustand (light global state)
	•	React Hook Form
	•	Zod
	•	i18next
	•	uuid
	•	vite-plugin-pwa

Backend:
	•	Supabase (Auth + Postgres + Storage)

Deployment target:
	•	Vercel

⸻

🧠 ARCHITECTURE RULES
	1.	The UI must NEVER depend directly on Supabase queries.
	2.	The app must always read/write from IndexedDB.
	3.	Supabase is only used for synchronization.
	4.	All inventory stock updates must be transactional.
	5.	Use soft deletes.
	6.	All entities must support synchronization metadata.
	7.	Internationalization must not allow hardcoded UI strings.

⸻

📂 REQUIRED FOLDER STRUCTURE

Create this structure:

src/
  app/
  core/
    db/
    sync/
    supabase/
  features/
    products/
    sales/
    consignments/
    inventory/
    dashboard/
  components/
  hooks/
  stores/
  i18n/
  utils/

Keep code modular by feature.

⸻

🗄️ DATA MODEL (OFFLINE-FIRST)

Each entity must include:
	•	id (uuid generated client-side)
	•	created_at
	•	updated_at
	•	synced (boolean)
	•	deleted (boolean)

⸻

PRODUCTS
	•	id
	•	organization_id
	•	name
	•	sku
	•	price
	•	cost
	•	stock
	•	min_stock
	•	image_url
	•	active
	•	created_at
	•	updated_at
	•	synced
	•	deleted

⸻

INVENTORY_MOVEMENTS
	•	id
	•	product_id
	•	type (IN | OUT | ADJUSTMENT | CONSIGNMENT_OUT | CONSIGNMENT_RETURN)
	•	quantity
	•	unit_price
	•	reference_type
	•	reference_id
	•	created_by
	•	created_at
	•	updated_at
	•	synced
	•	deleted

⸻

SALES
	•	id
	•	total
	•	status
	•	created_by
	•	created_at
	•	updated_at
	•	synced
	•	deleted

⸻

SALE_ITEMS
	•	id
	•	sale_id
	•	product_id
	•	quantity
	•	unit_price
	•	subtotal
	•	synced
	•	deleted

⸻

CONSIGNMENTS
	•	id
	•	customer_name
	•	status (open | closed)
	•	created_at
	•	updated_at
	•	synced
	•	deleted

⸻

CONSIGNMENT_ITEMS
	•	id
	•	consignment_id
	•	product_id
	•	quantity_delivered
	•	quantity_returned
	•	unit_price
	•	synced
	•	deleted

⸻

🔄 STOCK RULES

Stock must be stored as a field in products.

Every stock modification must:
	•	Run inside a Dexie transaction
	•	Update product.stock
	•	Insert corresponding inventory_movement
	•	Mark records as synced = false

⸻

🔄 SYNC ENGINE REQUIREMENTS

Create a synchronization engine that:

Triggers:
	•	On app start
	•	When connection is restored
	•	Every 60 seconds (if online)

⸻

PUSH PHASE

For each table:
	•	Fetch records where synced = false
	•	Upsert to Supabase
	•	On success:
	•	Mark synced = true
	•	Update updated_at with server timestamp

⸻

PULL PHASE

For each table:
	•	Fetch records from Supabase where updated_at > lastSync
	•	Merge locally
	•	Apply last-write-wins strategy

Store lastSync in localStorage.

⸻

📱 PWA CONFIGURATION

Use vite-plugin-pwa with:
	•	autoUpdate
	•	offline fallback
	•	runtime caching for Supabase endpoints and images
	•	installable manifest

⸻

🌍 INTERNATIONALIZATION

Use i18next.

Structure:

i18n/
  locales/
    en/common.json
    es/common.json

Requirements:
	•	No hardcoded UI strings
	•	Language auto-detection
	•	Manual language toggle
	•	Persist language in localStorage

⸻

🧩 UI REQUIREMENTS

Mobile-first design.

Include:
	•	Bottom navigation
	•	Floating Action Button for “New Sale”
	•	Dashboard:
	•	Total products
	•	Low stock count
	•	Products list with search
	•	Create/Edit product form
	•	New sale screen
	•	Basic consignment screen
	•	Settings screen (language toggle + manual sync button)

Use Tailwind for styling.

Keep UI clean and minimal.

⸻

🔐 SUPABASE REQUIREMENTS
	•	Include supabase client config
	•	Enable Row Level Security
	•	Restrict data by organization_id
	•	Use environment variables

Provide SQL migration file for table creation.

⸻

📦 DELIVERABLES

Generate:
	1.	Complete Vite project setup
	2.	Tailwind configuration
	3.	Dexie schema and initialization
	4.	Sync engine implementation
	5.	Supabase client setup
	6.	i18n setup
	7.	Product feature fully implemented (CRUD + stock update)
	8.	Basic Sale creation flow
	9.	PWA configuration
	10.	Clear README explaining architecture and sync logic

Code must be clean, typed, and modular.

Do not over-engineer.
Do not introduce unnecessary abstractions.
Keep it production-oriented but simple.

⸻

# 📋 PLAN DE TRABAJO POR FASES

Cada fase se trabaja en su propia feature branch y se mergea a `master` al completarse.
Las fases están ordenadas por dependencias: cada una construye sobre las anteriores.

⸻

## FASE 1 — Fundación del Proyecto
**Branch:** `feature/phase-1-foundation`
**Estado:** ✅ Completada

Objetivo: Levantar el proyecto base con todas las herramientas configuradas.

Tareas:
- [x] Inicializar proyecto Vite + React 18 + TypeScript
- [x] Configurar TailwindCSS
- [x] Crear la estructura de carpetas completa (`src/app/`, `src/core/`, `src/features/`, etc.)
- [x] Configurar ESLint + Prettier
- [x] Configurar vite-plugin-pwa (manifest, service worker, autoUpdate)
- [x] Crear archivo `.env.example` con variables de Supabase
- [x] Verificar que `npm run dev` y `npm run build` funcionan correctamente

⸻

## FASE 2 — Capa de Datos (Tipos + Dexie + Supabase)
**Branch:** `feature/phase-2-data-layer`
**Estado:** ✅ Completada

Objetivo: Definir todos los tipos TypeScript, inicializar Dexie con el esquema completo y configurar el cliente Supabase.

Tareas:
- [x] Definir interfaces TypeScript para todas las entidades (Product, InventoryMovement, Sale, SaleItem, Consignment, ConsignmentItem)
- [x] Incluir campos base en todas las entidades: `id`, `created_at`, `updated_at`, `synced`, `deleted`
- [x] Crear e inicializar Dexie DB con índices para todas las tablas
- [x] Configurar cliente Supabase (`src/core/supabase/client.ts`)
- [x] Crear archivo SQL de migración para Supabase (`supabase/migrations/`)
- [x] Incluir Row Level Security por `organization_id` en la migración

⸻

## FASE 3 — Internacionalización (i18n)
**Branch:** `feature/phase-3-i18n`
**Estado:** ✅ Completada

Objetivo: Configurar i18next para que todas las fases siguientes lo usen desde el inicio.

Tareas:
- [x] Instalar y configurar i18next + react-i18next
- [x] Crear archivos de traducción: `src/i18n/locales/en/common.json` y `es/common.json`
- [x] Implementar detección automática de idioma
- [x] Persistir idioma seleccionado en localStorage
- [x] Crear hook `useTranslation` wrapper si es necesario
- [x] Poblar traducciones base (navegación, botones comunes, labels genéricos)

⸻

## FASE 4 — App Shell y Navegación
**Branch:** `feature/phase-4-app-shell`
**Estado:** ✅ Completada

Objetivo: Crear el layout principal, navegación inferior, routing y la estructura visual base.

Tareas:
- [x] Instalar React Router
- [x] Crear layout principal con bottom navigation (Dashboard, Products, Sales, Consignments, Settings)
- [x] Implementar routing para todas las secciones
- [x] Crear componente FAB (Floating Action Button) para "Nueva Venta"
- [x] Diseño mobile-first con TailwindCSS
- [x] Crear componentes compartidos base: `PageHeader`, `EmptyState`, `LoadingSpinner`
- [x] Configurar Zustand store inicial (ej: UI state, sync status)

⸻

## FASE 5 — Feature: Productos (CRUD + Stock)
**Branch:** `feature/phase-5-products`
**Estado:** ✅ Completada

Objetivo: Implementar la funcionalidad completa de productos, incluyendo stock transaccional.

Tareas:
- [x] Lista de productos con búsqueda (por nombre/SKU)
- [x] Formulario crear/editar producto (React Hook Form + Zod validation)
- [x] CRUD completo contra Dexie (crear, leer, actualizar, soft-delete)
- [x] Lógica transaccional de stock: actualizar `product.stock` + insertar `inventory_movement` dentro de una transacción Dexie
- [x] Indicador visual de stock bajo (`stock <= min_stock`)
- [x] Todas las strings usando `t()` de i18next

⸻

## FASE 6 — Feature: Ventas
**Branch:** `feature/phase-6-sales`
**Estado:** ✅ Completada

Objetivo: Implementar el flujo de creación de ventas con descuento de inventario.

Tareas:
- [x] Pantalla de nueva venta: buscar y agregar productos
- [x] Carrito de venta con cantidades editables
- [x] Cálculo automático de subtotales y total
- [x] Al confirmar venta: crear `sale` + `sale_items` + descontar stock (transaccional)
- [x] Tipo de movimiento `OUT` en `inventory_movements`
- [x] Lista de ventas realizadas (historial básico)

⸻

## FASE 7 — Feature: Consignaciones
**Branch:** `feature/phase-7-consignments`
**Estado:** ✅ Completada

Objetivo: Implementar consignaciones con entrega y devolución de producto.

Tareas:
- [x] Crear consignación: nombre del cliente + selección de productos y cantidades
- [x] Al crear: descontar stock con movimiento tipo `CONSIGNMENT_OUT`
- [x] Pantalla de devolución: registrar cantidades devueltas
- [x] Al devolver: aumentar stock con movimiento tipo `CONSIGNMENT_RETURN`
- [x] Estado de consignación: `open` / `closed`
- [x] Lista de consignaciones con estado visible

⸻

## FASE 8 — Dashboard
**Branch:** `feature/phase-8-dashboard`
**Estado:** ✅ Completada

Objetivo: Pantalla principal con métricas clave del negocio.

Tareas:
- [x] Total de productos activos
- [x] Conteo de productos con stock bajo
- [x] Ventas recientes (últimos registros)
- [x] Resumen de consignaciones abiertas
- [x] Cards con diseño limpio y responsivo

⸻

## FASE 9 — Motor de Sincronización
**Branch:** `feature/phase-9-sync-engine`
**Estado:** ⬜ Pendiente

Objetivo: Implementar sincronización bidireccional con Supabase.

Tareas:
- [ ] **Push:** Para cada tabla, enviar registros con `synced = false` a Supabase (upsert), marcar `synced = true` on success
- [ ] **Pull:** Para cada tabla, traer registros de Supabase donde `updated_at > lastSync`, merge local con last-write-wins
- [ ] Almacenar `lastSync` en localStorage
- [ ] Triggers: al iniciar app, al restaurar conexión (`online` event), cada 60 segundos
- [ ] Indicador de estado de sincronización en la UI (Zustand store)
- [ ] Manejo de errores: no bloquear la app si la sync falla

⸻

## FASE 10 — Settings, PWA Polish y Documentación
**Branch:** `feature/phase-10-settings-polish`
**Estado:** ⬜ Pendiente

Objetivo: Pantalla de settings, pulir PWA y documentar el proyecto.

Tareas:
- [ ] Pantalla de Settings: toggle de idioma + botón de sync manual
- [ ] Revisar y completar configuración PWA (offline fallback, runtime caching para Supabase)
- [ ] Verificar instalabilidad del PWA
- [ ] Escribir README.md con: arquitectura, lógica de sync, setup local, variables de entorno
- [ ] Revisión final de traducciones en/es
- [ ] Limpiar código, verificar build production sin errores

⸻

## RESUMEN DE FASES

| # | Fase | Branch | Estado |
|---|------|--------|--------|
| 1 | Fundación del Proyecto | `feature/phase-1-foundation` | ✅ Completada |
| 2 | Capa de Datos | `feature/phase-2-data-layer` | ✅ Completada |
| 3 | Internacionalización | `feature/phase-3-i18n` | ✅ Completada |
| 4 | App Shell y Navegación | `feature/phase-4-app-shell` | ✅ Completada |
| 5 | Productos (CRUD + Stock) | `feature/phase-5-products` | ✅ Completada |
| 6 | Ventas | `feature/phase-6-sales` | ✅ Completada |
| 7 | Consignaciones | `feature/phase-7-consignments` | ✅ Completada |
| 8 | Dashboard | `feature/phase-8-dashboard` | ✅ Completada |
| 9 | Motor de Sincronización | `feature/phase-9-sync-engine` | ⬜ Pendiente |
| 10 | Settings, PWA y Docs | `feature/phase-10-settings-polish` | ⬜ Pendiente |