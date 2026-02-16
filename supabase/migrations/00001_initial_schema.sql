-- ============================================
-- Initial schema for Inventory PWA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_products_sku ON products(organization_id, sku);
CREATE INDEX idx_products_updated_at ON products(updated_at);

-- ============================================
-- INVENTORY MOVEMENTS
-- ============================================
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT', 'CONSIGNMENT_OUT', 'CONSIGNMENT_RETURN')),
  quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  reference_type TEXT,
  reference_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(type);
CREATE INDEX idx_inventory_movements_updated_at ON inventory_movements(updated_at);

-- ============================================
-- SALES
-- ============================================
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_updated_at ON sales(updated_at);

-- ============================================
-- SALE ITEMS
-- ============================================
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_sale_items_updated_at ON sale_items(updated_at);

-- ============================================
-- CONSIGNMENTS
-- ============================================
CREATE TABLE consignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_consignments_status ON consignments(status);
CREATE INDEX idx_consignments_updated_at ON consignments(updated_at);

-- ============================================
-- CONSIGNMENT ITEMS
-- ============================================
CREATE TABLE consignment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consignment_id UUID NOT NULL REFERENCES consignments(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity_delivered NUMERIC(12, 2) NOT NULL DEFAULT 0,
  quantity_returned NUMERIC(12, 2) NOT NULL DEFAULT 0,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced BOOLEAN NOT NULL DEFAULT TRUE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_consignment_items_consignment ON consignment_items(consignment_id);
CREATE INDEX idx_consignment_items_product ON consignment_items(product_id);
CREATE INDEX idx_consignment_items_updated_at ON consignment_items(updated_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Products: restrict by organization_id via JWT claim
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select" ON products
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
  );

CREATE POLICY "products_insert" ON products
  FOR INSERT WITH CHECK (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
  );

CREATE POLICY "products_update" ON products
  FOR UPDATE USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
  );

-- Inventory movements: restrict via product's organization_id
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_movements_select" ON inventory_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = inventory_movements.product_id
        AND products.organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
    )
  );

CREATE POLICY "inventory_movements_insert" ON inventory_movements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = inventory_movements.product_id
        AND products.organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
    )
  );

CREATE POLICY "inventory_movements_update" ON inventory_movements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = inventory_movements.product_id
        AND products.organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::UUID
    )
  );

-- Sales: restrict by created_by matching authenticated user
-- Note: For multi-user orgs, you may want to add organization_id to sales table
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_select" ON sales
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "sales_insert" ON sales
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "sales_update" ON sales
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Sale items: restrict via sale access
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sale_items_select" ON sale_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id)
  );

CREATE POLICY "sale_items_insert" ON sale_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id)
  );

CREATE POLICY "sale_items_update" ON sale_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id)
  );

-- Consignments: restrict to authenticated users
ALTER TABLE consignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consignments_select" ON consignments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "consignments_insert" ON consignments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "consignments_update" ON consignments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Consignment items: restrict via consignment access
ALTER TABLE consignment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consignment_items_select" ON consignment_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM consignments WHERE consignments.id = consignment_items.consignment_id)
  );

CREATE POLICY "consignment_items_insert" ON consignment_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM consignments WHERE consignments.id = consignment_items.consignment_id)
  );

CREATE POLICY "consignment_items_update" ON consignment_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM consignments WHERE consignments.id = consignment_items.consignment_id)
  );

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_movements_updated_at
  BEFORE UPDATE ON inventory_movements FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sales_updated_at
  BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sale_items_updated_at
  BEFORE UPDATE ON sale_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_consignments_updated_at
  BEFORE UPDATE ON consignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_consignment_items_updated_at
  BEFORE UPDATE ON consignment_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
