import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProductsPage } from '@/features/products/ProductsPage'
import { ProductDetailPage } from '@/features/products/ProductDetailPage'
import { ProductFormPage } from '@/features/products/ProductFormPage'
import { SalesPage } from '@/features/sales/SalesPage'
import { NewSalePage } from '@/features/sales/NewSalePage'
import { SaleDetailPage } from '@/features/sales/SaleDetailPage'
import { ConsignmentsPage } from '@/features/consignments/ConsignmentsPage'
import { NewConsignmentPage } from '@/features/consignments/NewConsignmentPage'
import { ConsignmentDetailPage } from '@/features/consignments/ConsignmentDetailPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { initAuthListener } from '@/core/supabase/auth'

function App() {
  useEffect(() => {
    const unsubscribe = initAuthListener()
    return unsubscribe
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/sales/:id" element={<SaleDetailPage />} />
          <Route path="/consignments" element={<ConsignmentsPage />} />
          <Route path="/consignments/new" element={<NewConsignmentPage />} />
          <Route path="/consignments/:id" element={<ConsignmentDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { App }
