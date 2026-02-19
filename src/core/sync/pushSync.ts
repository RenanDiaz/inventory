import type { Table } from 'dexie';
import { db } from '../db';
import { supabase } from '../supabase/client';
import type { BaseEntity } from '../db/types';

interface TableConfig {
  name: string;
  table: Table<BaseEntity, string>;
}

/**
 * Tables ordered by FK dependencies: parents before children.
 */
const TABLES: TableConfig[] = [
  { name: 'products', table: db.products as unknown as Table<BaseEntity, string> },
  { name: 'inventory_movements', table: db.inventory_movements as unknown as Table<BaseEntity, string> },
  { name: 'sales', table: db.sales as unknown as Table<BaseEntity, string> },
  { name: 'sale_items', table: db.sale_items as unknown as Table<BaseEntity, string> },
  { name: 'consignments', table: db.consignments as unknown as Table<BaseEntity, string> },
  { name: 'consignment_items', table: db.consignment_items as unknown as Table<BaseEntity, string> },
];

const BATCH_SIZE = 50;

/**
 * Push all locally modified records (synced = false) to Supabase.
 * Processes tables in FK-dependency order and batches upserts.
 */
export async function pushSync(): Promise<void> {
  for (const { name, table } of TABLES) {
    const unsynced = await table
      .where('synced')
      .equals(0) // Dexie stores booleans as 0/1
      .toArray();

    if (unsynced.length === 0) continue;

    // Process in batches
    for (let i = 0; i < unsynced.length; i += BATCH_SIZE) {
      const batch = unsynced.slice(i, i + BATCH_SIZE);

      // Prepare records for Supabase: set synced = true on server
      const records = batch.map((record) => ({
        ...record,
        synced: true,
      }));

      const { data, error } = await supabase
        .from(name)
        .upsert(records, { onConflict: 'id' })
        .select('id, updated_at');

      if (error) {
        console.error(`[Sync Push] Error upserting to ${name}:`, error.message);
        throw new Error(`Push failed for ${name}: ${error.message}`);
      }

      // Update local records with server timestamps and mark as synced
      if (data && data.length > 0) {
        const updates = data.map((row: { id: string; updated_at: string }) => ({
          id: row.id,
          updated_at: row.updated_at,
          synced: true,
        }));

        await db.transaction('rw', table, async () => {
          for (const update of updates) {
            await table.update(update.id, {
              synced: true,
              updated_at: update.updated_at,
            } as Partial<BaseEntity>);
          }
        });
      }
    }
  }
}
