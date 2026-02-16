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