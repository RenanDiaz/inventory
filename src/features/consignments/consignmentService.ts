import { db } from '@/core/db'
import { createBaseEntity, markAsUpdated } from '@/core/db/helpers'
import type { Consignment, ConsignmentItem, Product } from '@/core/db/types'
import { adjustStock } from '@/features/products/productService'

export interface DeliveryItem {
  product: Product
  quantity: number
}

export interface ConsignmentItemWithProduct extends ConsignmentItem {
  productName: string
}

export interface ConsignmentWithItems extends Consignment {
  items: ConsignmentItemWithProduct[]
}

/**
 * Creates a consignment transactionally: consignment record + consignment_items + stock deductions (CONSIGNMENT_OUT).
 */
export async function createConsignment(
  customerName: string,
  deliveryItems: DeliveryItem[],
): Promise<Consignment> {
  const base = createBaseEntity()

  const consignment: Consignment = {
    ...base,
    customer_name: customerName,
    status: 'open',
  }

  await db.transaction(
    'rw',
    [db.consignments, db.consignment_items, db.products, db.inventory_movements],
    async () => {
      await db.consignments.add(consignment)

      for (const item of deliveryItems) {
        const consignmentItem: ConsignmentItem = {
          ...createBaseEntity(),
          consignment_id: consignment.id,
          product_id: item.product.id,
          quantity_delivered: item.quantity,
          quantity_returned: 0,
          unit_price: item.product.price,
        }
        await db.consignment_items.add(consignmentItem)

        await adjustStock(
          item.product.id,
          item.quantity,
          'CONSIGNMENT_OUT',
          item.product.price,
          'consignment',
          consignment.id,
        )
      }
    },
  )

  return consignment
}

/**
 * Fetches all non-deleted consignments, sorted by most recent first.
 */
export async function getConsignments(): Promise<Consignment[]> {
  const consignments = await db.consignments.filter((c) => !c.deleted).toArray()
  return consignments.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

/**
 * Fetches a single consignment by ID.
 */
export async function getConsignment(id: string): Promise<Consignment | undefined> {
  return db.consignments.get(id)
}

/**
 * Fetches consignment items for a given consignment ID.
 */
export async function getConsignmentItems(consignmentId: string): Promise<ConsignmentItem[]> {
  return db.consignment_items
    .where('consignment_id')
    .equals(consignmentId)
    .filter((i) => !i.deleted)
    .toArray()
}

/**
 * Fetches a consignment with its items and product names.
 */
export async function getConsignmentWithItems(
  id: string,
): Promise<ConsignmentWithItems | undefined> {
  const consignment = await db.consignments.get(id)
  if (!consignment) return undefined

  const items = await getConsignmentItems(id)
  const itemsWithNames = await Promise.all(
    items.map(async (item) => {
      const product = await db.products.get(item.product_id)
      return { ...item, productName: product?.name ?? '—' }
    }),
  )

  return { ...consignment, items: itemsWithNames }
}

/**
 * Processes returns for a consignment transactionally.
 * Updates consignment_items with returned quantities and adjusts stock (CONSIGNMENT_RETURN).
 */
export async function returnConsignmentItems(
  consignmentId: string,
  returns: { itemId: string; productId: string; quantity: number; unitPrice: number }[],
): Promise<void> {
  await db.transaction(
    'rw',
    [db.consignment_items, db.products, db.inventory_movements],
    async () => {
      for (const ret of returns) {
        if (ret.quantity <= 0) continue

        const item = await db.consignment_items.get(ret.itemId)
        if (!item) continue

        const newReturned = item.quantity_returned + ret.quantity

        await db.consignment_items.update(ret.itemId, {
          quantity_returned: newReturned,
          ...markAsUpdated(),
        })

        await adjustStock(
          ret.productId,
          ret.quantity,
          'CONSIGNMENT_RETURN',
          ret.unitPrice,
          'consignment',
          consignmentId,
        )
      }
    },
  )
}

/**
 * Closes a consignment. Sets status to 'closed'.
 */
export async function closeConsignment(id: string): Promise<void> {
  await db.consignments.update(id, {
    status: 'closed' as const,
    ...markAsUpdated(),
  })
}
