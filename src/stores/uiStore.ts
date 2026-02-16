import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface UIState {
  syncStatus: SyncStatus
  isOnline: boolean
  setSyncStatus: (status: SyncStatus) => void
  setIsOnline: (online: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  syncStatus: 'idle',
  isOnline: navigator.onLine,
  setSyncStatus: (status) => set({ syncStatus: status }),
  setIsOnline: (online) => set({ isOnline: online }),
}))
