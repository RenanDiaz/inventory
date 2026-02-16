/**
 * Base fields shared by all entities for offline-first sync support.
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
  deleted: boolean;
}

/**
 * Product entity.
 */
export interface Product extends BaseEntity {
  organization_id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  image_url: string | null;
  active: boolean;
}

/**
 * Inventory movement types.
 */
export type InventoryMovementType =
  | 'IN'
  | 'OUT'
  | 'ADJUSTMENT'
  | 'CONSIGNMENT_OUT'
  | 'CONSIGNMENT_RETURN';

/**
 * Inventory movement entity.
 */
export interface InventoryMovement extends BaseEntity {
  product_id: string;
  type: InventoryMovementType;
  quantity: number;
  unit_price: number;
  reference_type: string | null;
  reference_id: string | null;
  created_by: string | null;
}

/**
 * Sale status.
 */
export type SaleStatus = 'completed' | 'cancelled';

/**
 * Sale entity.
 */
export interface Sale extends BaseEntity {
  total: number;
  status: SaleStatus;
  created_by: string | null;
}

/**
 * Sale item entity.
 */
export interface SaleItem extends BaseEntity {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/**
 * Consignment status.
 */
export type ConsignmentStatus = 'open' | 'closed';

/**
 * Consignment entity.
 */
export interface Consignment extends BaseEntity {
  customer_name: string;
  status: ConsignmentStatus;
}

/**
 * Consignment item entity.
 */
export interface ConsignmentItem extends BaseEntity {
  consignment_id: string;
  product_id: string;
  quantity_delivered: number;
  quantity_returned: number;
  unit_price: number;
}
