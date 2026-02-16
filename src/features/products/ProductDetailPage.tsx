import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getProduct, deleteProduct, adjustStock } from './productService'
import type { Product, InventoryMovementType } from '@/core/db/types'

export function ProductDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdjust, setShowAdjust] = useState(false)
  const [adjustQty, setAdjustQty] = useState('')
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('IN')

  useEffect(() => {
    if (id) {
      getProduct(id).then((p) => {
        setProduct(p ?? null)
        setLoading(false)
      })
    }
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    const confirmed = window.confirm(t('products.deleteConfirm'))
    if (!confirmed) return
    await deleteProduct(id)
    navigate('/products')
  }

  const handleAdjustStock = async () => {
    if (!id || !product) return
    const qty = parseInt(adjustQty, 10)
    if (isNaN(qty) || qty <= 0) return

    await adjustStock(id, qty, adjustType, product.cost)
    const updated = await getProduct(id)
    setProduct(updated ?? null)
    setShowAdjust(false)
    setAdjustQty('')
  }

  if (loading) return <LoadingSpinner />
  if (!product) return null

  const isLowStock = product.stock <= product.min_stock

  return (
    <div>
      <PageHeader
        title={product.name}
        showBack
        action={
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t('common.edit')}
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <DetailRow label={t('products.sku')} value={product.sku} />
          <DetailRow label={t('products.price')} value={`$${product.price.toFixed(2)}`} />
          <DetailRow label={t('products.cost')} value={`$${product.cost.toFixed(2)}`} />
          <DetailRow
            label={t('products.stock')}
            value={String(product.stock)}
            highlight={isLowStock}
          />
          <DetailRow label={t('products.minStock')} value={String(product.min_stock)} />
          <DetailRow
            label={t('products.status')}
            value={product.active ? t('products.active') : t('products.inactive')}
          />
        </div>

        {isLowStock && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600">&#x26A0;</span>
            <p className="text-sm text-red-700">{t('products.lowStock')}</p>
          </div>
        )}

        <button
          onClick={() => setShowAdjust(!showAdjust)}
          className="w-full px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          {t('products.adjustStock')}
        </button>

        {showAdjust && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.type.label')}
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as InventoryMovementType)}
                className="input"
              >
                <option value="IN">{t('inventory.type.IN')}</option>
                <option value="OUT">{t('inventory.type.OUT')}</option>
                <option value="ADJUSTMENT">{t('inventory.type.ADJUSTMENT')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.quantity')}
              </label>
              <input
                type="number"
                min="1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAdjust(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleAdjustStock}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleDelete}
          className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
        >
          {t('common.delete')}
        </button>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}
