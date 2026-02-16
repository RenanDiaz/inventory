import { v4 as uuidv4 } from 'uuid';
import type { BaseEntity } from './types';

/**
 * Creates the base fields for a new entity.
 */
export function createBaseEntity(): BaseEntity {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    created_at: now,
    updated_at: now,
    synced: false,
    deleted: false,
  };
}

/**
 * Returns updated sync metadata fields for marking an entity as modified.
 */
export function markAsUpdated(): Pick<BaseEntity, 'updated_at' | 'synced'> {
  return {
    updated_at: new Date().toISOString(),
    synced: false,
  };
}

/**
 * Returns fields for a soft delete.
 */
export function markAsDeleted(): Pick<BaseEntity, 'updated_at' | 'synced' | 'deleted'> {
  return {
    updated_at: new Date().toISOString(),
    synced: false,
    deleted: true,
  };
}
