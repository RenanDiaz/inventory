import { useEffect } from 'react';
import { startSyncEngine } from '../core/sync';

/**
 * Hook that starts the sync engine on mount and cleans up on unmount.
 * Should be called once in the root layout.
 */
export function useSync(): void {
  useEffect(() => {
    const cleanup = startSyncEngine();
    return cleanup;
  }, []);
}
