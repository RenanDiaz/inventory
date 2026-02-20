import { db } from '@/core/db'
import { createBaseEntity, markAsUpdated, markAsDeleted } from '@/core/db/helpers'
import type { Product, InventoryMovement, InventoryMovementType } from '@/core/db/types'
import { useAuthStore } from '@/stores/authStore'

export interface CreateProductInput {
  organization_id: string
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  min_stock: number
  image_url?: string | null
  active?: boolean
}

export interface UpdateProductInput {
  name?: string
  sku?: string
  price?: number
  cost?: number
  min_stock?: number
  image_url?: string | null
  active?: boolean
}

/**
 * Fetches all non-deleted products, optionally filtered by search query.
 */
export async function getProducts(search?: string): Promise<Product[]> {
  let products = await db.products.filter((p) => !p.deleted).toArray()

  if (search) {
    const q = search.toLowerCase()
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    )
  }

  return products.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

/**
 * Fetches a single product by ID.
 */
export async function getProduct(id: string): Promise<Product | undefined> {
  return db.products.get(id)
}

/**
 * Creates a new product. If initial stock > 0, creates an IN movement transactionally.
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const base = createBaseEntity()
  const product: Product = {
    ...base,
    organization_id: input.organization_id,
    name: input.name,
    sku: input.sku,
    price: input.price,
    cost: input.cost,
    stock: input.stock,
    min_stock: input.min_stock,
    image_url: input.image_url ?? null,
    active: input.active ?? true,
  }

  await db.transaction('rw', [db.products, db.inventory_movements], async () => {
    await db.products.add(product)

    if (product.stock > 0) {
      const movementBase = createBaseEntity()
      const movement: InventoryMovement = {
        ...movementBase,
        product_id: product.id,
        type: 'IN',
        quantity: product.stock,
        unit_price: product.cost,
        reference_type: 'initial_stock',
        reference_id: null,
        created_by: useAuthStore.getState().user?.id ?? null,
      }
      await db.inventory_movements.add(movement)
    }
  })

  return product
}

/**
 * Updates a product's basic info (not stock). Marks as unsynced.
 */
export async function updateProduct(id: string, input: UpdateProductInput): Promise<void> {
  await db.products.update(id, {
    ...input,
    ...markAsUpdated(),
  })
}

/**
 * Soft-deletes a product.
 */
export async function deleteProduct(id: string): Promise<void> {
  await db.products.update(id, markAsDeleted())
}

/**
 * Adjusts product stock transactionally: updates product.stock and inserts an inventory_movement.
 */
export async function adjustStock(
  productId: string,
  quantity: number,
  type: InventoryMovementType,
  unitPrice: number,
  referenceType?: string | null,
  referenceId?: string | null,
): Promise<void> {
  await db.transaction('rw', [db.products, db.inventory_movements], async () => {
    const product = await db.products.get(productId)
    if (!product) throw new Error(`Product ${productId} not found`)

    let newStock: number
    switch (type) {
      case 'IN':
      case 'CONSIGNMENT_RETURN':
        newStock = product.stock + quantity
        break
      case 'OUT':
      case 'CONSIGNMENT_OUT':
        newStock = product.stock - quantity
        break
      case 'ADJUSTMENT':
        newStock = quantity
        break
    }

    await db.products.update(productId, {
      stock: newStock,
      ...markAsUpdated(),
    })

    const movementBase = createBaseEntity()
    const movement: InventoryMovement = {
      ...movementBase,
      product_id: productId,
      type,
      quantity,
      unit_price: unitPrice,
      reference_type: referenceType ?? null,
      reference_id: referenceId ?? null,
      created_by: useAuthStore.getState().user?.id ?? null,
    }
    await db.inventory_movements.add(movement)
  })
}
