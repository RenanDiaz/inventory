import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getDashboardMetrics, type DashboardMetrics } from './dashboardService'

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardMetrics().then((data) => {
      setMetrics(data)
      setLoading(false)
    })
  }, [])

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div>
        <PageHeader title={t('dashboard.title')} />
        <LoadingSpinner />
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      <div className="p-4 space-y-4">
        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/products')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <p className="text-xs text-gray-500">{t('dashboard.totalProducts')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
          </button>

          <div
            className={`bg-white rounded-xl p-4 shadow-sm border text-left ${
              metrics.lowStockCount > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className={`w-4 h-4 ${metrics.lowStockCount > 0 ? 'text-red-500' : 'text-yellow-500'}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-xs text-gray-500">{t('dashboard.lowStock')}</p>
            </div>
            <p className={`text-2xl font-bold ${metrics.lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {metrics.lowStockCount}
            </p>
          </div>

          <button
            onClick={() => navigate('/sales')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              <p className="text-xs text-gray-500">{t('dashboard.recentSales')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.recentSales.length}</p>
          </button>

          <button
            onClick={() => navigate('/consignments')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.149-.504 1.149-1.125v-5.082a1.125 1.125 0 0 0-.327-.795l-3.163-3.163A1.125 1.125 0 0 0 17.191 8H15.75m-7.5 6.75H15m-7.5 0v-3.375c0-.621.504-1.125 1.125-1.125h3.375" />
              </svg>
              <p className="text-xs text-gray-500">{t('dashboard.openConsignments')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.openConsignments.length}</p>
          </button>
        </div>

        {/* Low stock products */}
        {metrics.lowStockProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.lowStockProducts')}</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {metrics.lowStockProducts.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 text-left"
                  >
                    <span className="text-sm text-gray-900 truncate">{product.name}</span>
                    <span className="text-xs font-medium text-red-600 shrink-0 ml-2">
                      {product.stock} / {product.min_stock}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent sales */}
        {metrics.recentSales.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.recentSalesTitle')}</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {metrics.recentSales.map((sale) => (
                <li key={sale.id}>
                  <button
                    onClick={() => navigate(`/sales/${sale.id}`)}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{formatDate(sale.created_at)}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sale.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {t(`sales.status.${sale.status}`)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Open consignments */}
        {metrics.openConsignments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.openConsignmentsTitle')}</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {metrics.openConsignments.map((consignment) => (
                <li key={consignment.id}>
                  <button
                    onClick={() => navigate(`/consignments/${consignment.id}`)}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consignment.customer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(consignment.created_at)}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                      {t('consignments.status.open')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
