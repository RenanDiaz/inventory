import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getProducts } from './productService'
import type { Product } from '@/core/db/types'
import { formatCurrency } from '@/utils/currency'

export function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    const results = await getProducts(search || undefined)
    setProducts(results)
    setLoading(false)
  }, [search])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div>
      <PageHeader
        title={t('products.title')}
        action={
          <button
            onClick={() => navigate('/products/new')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + {t('products.newProduct')}
          </button>
        }
      />

      <div className="px-4 py-3">
        <input
          type="text"
          placeholder={t('products.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
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
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          }
          message={search ? t('common.noResults') : t('products.noProducts')}
        />
      ) : (
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    {!product.active && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {t('products.inactive')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{product.sku}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      product.stock <= product.min_stock
                        ? 'text-red-600 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('products.stock')}: {product.stock}
                    {product.stock <= product.min_stock && (
                      <span className="ml-1">&#x26A0;</span>
                    )}
                  </p>
                </div>

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
