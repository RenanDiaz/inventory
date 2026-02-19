import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getSaleWithItems, type SaleWithItems } from './salesService'
import { formatCurrency } from '@/utils/currency'

export function SaleDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [sale, setSale] = useState<SaleWithItems | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getSaleWithItems(id).then((result) => {
        setSale(result ?? null)
        setLoading(false)
      })
    }
  }, [id])

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <LoadingSpinner />
  if (!sale) return null

  return (
    <div>
      <PageHeader title={t('sales.saleDetail')} showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Sale info */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500">{t('sales.date')}</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(sale.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500">{t('products.status')}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                sale.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {t(`sales.status.${sale.status}`)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500">{t('sales.total')}</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(sale.total)}
            </span>
          </div>
        </div>

        {/* Sale items */}
        <h2 className="text-sm font-medium text-gray-700">{t('sales.items')}</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {sale.items.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatCurrency(item.unit_price)} &times; {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900 shrink-0">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
