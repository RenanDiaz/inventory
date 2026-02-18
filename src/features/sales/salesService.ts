import { db } from '@/core/db'
import { createBaseEntity, markAsUpdated } from '@/core/db/helpers'
import type { Sale, SaleItem, Product } from '@/core/db/types'
import { adjustStock } from '@/features/products/productService'

export interface CartItem {
  product: Product
  quantity: number
}

export interface SaleWithItems extends Sale {
  items: (SaleItem & { productName: string })[]
}

/**
 * Creates a sale transactionally: sale record + sale_items + stock deductions.
 */
export async function createSale(cartItems: CartItem[]): Promise<Sale> {
  const saleBase = createBaseEntity()
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const sale: Sale = {
    ...saleBase,
    total,
    status: 'completed',
    created_by: null,
  }

  await db.transaction(
    'rw',
    [db.sales, db.sale_items, db.products, db.inventory_movements],
    async () => {
      await db.sales.add(sale)

      for (const cartItem of cartItems) {
        const subtotal = cartItem.product.price * cartItem.quantity

        const saleItem: SaleItem = {
          ...createBaseEntity(),
          sale_id: sale.id,
          product_id: cartItem.product.id,
          quantity: cartItem.quantity,
          unit_price: cartItem.product.price,
          subtotal,
        }
        await db.sale_items.add(saleItem)

        await adjustStock(
          cartItem.product.id,
          cartItem.quantity,
          'OUT',
          cartItem.product.price,
          'sale',
          sale.id,
        )
      }
    },
  )

  return sale
}

/**
 * Fetches all non-deleted sales, sorted by most recent first.
 */
export async function getSales(): Promise<Sale[]> {
  const sales = await db.sales.filter((s) => !s.deleted).toArray()
  return sales.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

/**
 * Fetches a single sale by ID.
 */
export async function getSale(id: string): Promise<Sale | undefined> {
  return db.sales.get(id)
}

/**
 * Fetches sale items for a given sale ID.
 */
export async function getSaleItems(saleId: string): Promise<SaleItem[]> {
  return db.sale_items.where('sale_id').equals(saleId).filter((i) => !i.deleted).toArray()
}

/**
 * Fetches a sale with its items and product names.
 */
export async function getSaleWithItems(id: string): Promise<SaleWithItems | undefined> {
  const sale = await db.sales.get(id)
  if (!sale) return undefined

  const items = await getSaleItems(id)
  const itemsWithNames = await Promise.all(
    items.map(async (item) => {
      const product = await db.products.get(item.product_id)
      return { ...item, productName: product?.name ?? '—' }
    }),
  )

  return { ...sale, items: itemsWithNames }
}

/**
 * Cancels a sale. Updates status to cancelled but does NOT revert stock.
 */
export async function cancelSale(id: string): Promise<void> {
  await db.sales.update(id, {
    status: 'cancelled' as const,
    ...markAsUpdated(),
  })
}
