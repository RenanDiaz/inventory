import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface UIState {
  syncStatus: SyncStatus
  isOnline: boolean
  lastSyncTime: string | null
  setSyncStatus: (status: SyncStatus) => void
  setIsOnline: (online: boolean) => void
  setLastSyncTime: (time: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  syncStatus: 'idle',
  isOnline: navigator.onLine,
  lastSyncTime: null,
  setSyncStatus: (status) => set({ syncStatus: status }),
  setIsOnline: (online) => set({ isOnline: online }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}))
