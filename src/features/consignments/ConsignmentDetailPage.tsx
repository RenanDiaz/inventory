import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  getConsignmentWithItems,
  returnConsignmentItems,
  closeConsignment,
  type ConsignmentWithItems,
} from './consignmentService'

export function ConsignmentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [consignment, setConsignment] = useState<ConsignmentWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReturn, setShowReturn] = useState(false)
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    if (id) {
      getConsignmentWithItems(id).then((result) => {
        setConsignment(result ?? null)
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleOpenReturn = () => {
    if (!consignment) return
    const initial: Record<string, number> = {}
    for (const item of consignment.items) {
      const remaining = item.quantity_delivered - item.quantity_returned
      if (remaining > 0) {
        initial[item.id] = 0
      }
    }
    setReturnQuantities(initial)
    setShowReturn(true)
  }

  const handleReturn = async () => {
    if (!consignment) return
    const returns = consignment.items
      .filter((item) => (returnQuantities[item.id] ?? 0) > 0)
      .map((item) => ({
        itemId: item.id,
        productId: item.product_id,
        quantity: returnQuantities[item.id],
        unitPrice: item.unit_price,
      }))

    if (returns.length === 0) return

    setSubmitting(true)
    try {
      await returnConsignmentItems(consignment.id, returns)
      setShowReturn(false)
      setReturnQuantities({})
      setLoading(true)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = async () => {
    if (!consignment) return
    setSubmitting(true)
    try {
      await closeConsignment(consignment.id)
      setLoading(true)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!consignment) return null

  const isOpen = consignment.status === 'open'
  const hasReturnableItems = consignment.items.some(
    (item) => item.quantity_delivered - item.quantity_returned > 0,
  )

  return (
    <div>
      <PageHeader
        title={consignment.customer_name}
        showBack
        action={
          isOpen ? (
            <button
              onClick={handleClose}
              disabled={submitting}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {t('consignments.closeConsignment')}
            </button>
          ) : undefined
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Consignment info */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500">{t('sales.date')}</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(consignment.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500">{t('products.status')}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                consignment.status === 'open'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t(`consignments.status.${consignment.status}`)}
            </span>
          </div>
        </div>

        {/* Items */}
        <h2 className="text-sm font-medium text-gray-700">
          {t('consignments.items')}
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {consignment.items.map((item) => {
            const remaining = item.quantity_delivered - item.quantity_returned
            return (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ${item.unit_price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span>
                    {t('consignments.quantityDelivered')}: {item.quantity_delivered}
                  </span>
                  <span>
                    {t('consignments.quantityReturned')}: {item.quantity_returned}
                  </span>
                  <span className={remaining > 0 ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
                    {t('consignments.pending')}: {remaining}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Return button */}
        {isOpen && hasReturnableItems && !showReturn && (
          <button
            onClick={handleOpenReturn}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {t('consignments.return')}
          </button>
        )}

        {/* Return modal */}
        {showReturn && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-700">
              {t('consignments.returnItems')}
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {consignment.items
                .filter((item) => item.quantity_delivered - item.quantity_returned > 0)
                .map((item) => {
                  const maxReturn = item.quantity_delivered - item.quantity_returned
                  const qty = returnQuantities[item.id] ?? 0
                  return (
                    <div key={item.id} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {t('consignments.pending')}: {maxReturn}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setReturnQuantities((prev) => ({
                                ...prev,
                                [item.id]: Math.max(0, qty - 1),
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            &minus;
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={maxReturn}
                            value={qty}
                            onChange={(e) => {
                              const val = Math.min(
                                parseInt(e.target.value, 10) || 0,
                                maxReturn,
                              )
                              setReturnQuantities((prev) => ({
                                ...prev,
                                [item.id]: Math.max(0, val),
                              }))
                            }}
                            className="w-14 text-center text-sm border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() =>
                              setReturnQuantities((prev) => ({
                                ...prev,
                                [item.id]: Math.min(maxReturn, qty + 1),
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReturn(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleReturn}
                disabled={
                  submitting ||
                  Object.values(returnQuantities).every((q) => q === 0)
                }
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? t('common.loading') : t('common.confirm')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
