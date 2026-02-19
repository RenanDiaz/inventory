import { pushSync } from './pushSync';
import { pullSync } from './pullSync';
import { useUIStore } from '../../stores/uiStore';

const LAST_SYNC_KEY = 'lastSync';
const SYNC_INTERVAL_MS = 60_000; // 60 seconds

let syncIntervalId: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

function getLastSync(): string {
  return localStorage.getItem(LAST_SYNC_KEY) || '1970-01-01T00:00:00.000Z';
}

function setLastSync(timestamp: string): void {
  localStorage.setItem(LAST_SYNC_KEY, timestamp);
}

/**
 * Run a full sync cycle: push local changes, then pull remote changes.
 * Non-blocking — errors are caught and surfaced via the UI store.
 */
export async function runSync(): Promise<void> {
  if (isSyncing) return;

  const { setSyncStatus, setLastSyncTime } = useUIStore.getState();

  // Don't attempt sync if offline
  if (!navigator.onLine) return;

  isSyncing = true;
  setSyncStatus('syncing');

  try {
    const syncStart = new Date().toISOString();
    const lastSync = getLastSync();

    // Phase 1: Push local changes to server
    await pushSync();

    // Phase 2: Pull remote changes
    await pullSync(lastSync);

    // Update lastSync timestamp
    setLastSync(syncStart);
    setLastSyncTime(syncStart);
    setSyncStatus('success');
  } catch (error) {
    console.error('[Sync] Sync cycle failed:', error);
    setSyncStatus('error');
  } finally {
    isSyncing = false;
  }
}

/**
 * Start the automatic sync engine:
 * - Run an immediate sync
 * - Set up a 60-second interval
 * - Listen for online events to sync on reconnection
 */
export function startSyncEngine(): () => void {
  // Initialize lastSyncTime in store from localStorage
  const stored = localStorage.getItem(LAST_SYNC_KEY);
  if (stored) {
    useUIStore.getState().setLastSyncTime(stored);
  }

  // Initial sync
  runSync();

  // Periodic sync every 60 seconds
  syncIntervalId = setInterval(() => {
    runSync();
  }, SYNC_INTERVAL_MS);

  // Sync when connection is restored
  const handleOnline = () => {
    runSync();
  };
  window.addEventListener('online', handleOnline);

  // Return cleanup function
  return () => {
    if (syncIntervalId !== null) {
      clearInterval(syncIntervalId);
      syncIntervalId = null;
    }
    window.removeEventListener('online', handleOnline);
  };
}
