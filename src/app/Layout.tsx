import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { FloatingActionButton } from '@/components/FloatingActionButton'
import { useUIStore } from '@/stores/uiStore'
import { useSync } from '@/hooks/useSync'

const pagesWithFAB = ['/', '/products', '/sales', '/dashboard']

export function Layout() {
  const location = useLocation()
  const setIsOnline = useUIStore((s) => s.setIsOnline)
  const showFAB = pagesWithFAB.includes(location.pathname)

  // Start sync engine (initial sync, 60s interval, online reconnection)
  useSync()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  return (
    <div className="min-h-dvh bg-gray-50 pb-16">
      <Outlet />
      {showFAB && <FloatingActionButton />}
      <BottomNav />
    </div>
  )
}
