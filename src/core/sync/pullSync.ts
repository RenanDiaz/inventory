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

const PAGE_SIZE = 500;

/**
 * Pull records from Supabase that have been updated since lastSync.
 * Applies last-write-wins: server record wins unless the local record
 * has pending changes (synced = false).
 */
export async function pullSync(lastSync: string): Promise<void> {
  for (const { name, table } of TABLES) {
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(name)
        .select('*')
        .gt('updated_at', lastSync)
        .order('updated_at', { ascending: true })
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        console.error(`[Sync Pull] Error fetching ${name}:`, error.message);
        throw new Error(`Pull failed for ${name}: ${error.message}`);
      }

      if (!data || data.length === 0) {
        hasMore = false;
        break;
      }

      await db.transaction('rw', table, async () => {
        for (const remote of data) {
          const local = await table.get(remote.id);

          if (local && !local.synced) {
            // Local record has pending changes — skip (will be pushed next cycle).
            // Last-write-wins: local unsynced changes take priority for now.
            continue;
          }

          // Insert or overwrite with server data, marked as synced
          await table.put({ ...remote, synced: true } as BaseEntity);
        }
      });

      hasMore = data.length === PAGE_SIZE;
      from += PAGE_SIZE;
    }
  }
}
