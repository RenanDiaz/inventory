import Dexie, { type Table } from 'dexie';
import type {
  Product,
  InventoryMovement,
  Sale,
  SaleItem,
  Consignment,
  ConsignmentItem,
} from './types';

export class InventoryDatabase extends Dexie {
  products!: Table<Product, string>;
  inventory_movements!: Table<InventoryMovement, string>;
  sales!: Table<Sale, string>;
  sale_items!: Table<SaleItem, string>;
  consignments!: Table<Consignment, string>;
  consignment_items!: Table<ConsignmentItem, string>;

  constructor() {
    super('inventory-db');

    this.version(1).stores({
      products: 'id, organization_id, sku, name, active, synced, deleted, updated_at',
      inventory_movements: 'id, product_id, type, reference_id, synced, deleted, updated_at',
      sales: 'id, status, created_by, synced, deleted, updated_at',
      sale_items: 'id, sale_id, product_id, synced, deleted',
      consignments: 'id, status, synced, deleted, updated_at',
      consignment_items: 'id, consignment_id, product_id, synced, deleted',
    });
  }
}

export const db = new InventoryDatabase();
