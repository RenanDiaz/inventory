import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
