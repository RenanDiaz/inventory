import { db } from '@/core/db'
import type { Sale, Consignment } from '@/core/db/types'

export interface DashboardMetrics {
  totalProducts: number
  lowStockCount: number
  lowStockProducts: { id: string; name: string; stock: number; min_stock: number }[]
  recentSales: Sale[]
  openConsignments: Consignment[]
}

/**
 * Fetches all dashboard metrics from Dexie in a single call.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const products = await db.products.filter((p) => !p.deleted && p.active).toArray()
  const totalProducts = products.length

  const lowStockProducts = products
    .filter((p) => p.stock <= p.min_stock)
    .sort((a, b) => a.stock - b.stock)
    .map((p) => ({ id: p.id, name: p.name, stock: p.stock, min_stock: p.min_stock }))
  const lowStockCount = lowStockProducts.length

  const allSales = await db.sales.filter((s) => !s.deleted).toArray()
  const recentSales = allSales
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)

  const openConsignments = (await db.consignments.filter((c) => !c.deleted && c.status === 'open').toArray())
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

  return {
    totalProducts,
    lowStockCount,
    lowStockProducts,
    recentSales,
    openConsignments,
  }
}
