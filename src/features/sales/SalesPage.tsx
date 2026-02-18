import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getSales } from './salesService'
import type { Sale } from '@/core/db/types'

export function SalesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSales().then((results) => {
      setSales(results)
      setLoading(false)
    })
  }, [])

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

  return (
    <div>
      <PageHeader
        title={t('sales.title')}
        action={
          <button
            onClick={() => navigate('/sales/new')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + {t('sales.newSale')}
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : sales.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          }
          message={t('sales.noSales')}
        />
      ) : (
        <ul className="divide-y divide-gray-200">
          {sales.map((sale) => (
            <li key={sale.id}>
              <button
                onClick={() => navigate(`/sales/${sale.id}`)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    ${sale.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(sale.created_at)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    sale.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t(`sales.status.${sale.status}`)}
                </span>

                <svg
                  className="w-5 h-5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
