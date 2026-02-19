import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { getProducts } from '@/features/products/productService'
import { createSale, type CartItem } from './salesService'
import type { Product } from '@/core/db/types'
import { formatCurrency } from '@/utils/currency'

export function NewSalePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadProducts = useCallback(async () => {
    const results = await getProducts(search || undefined)
    setProducts(results.filter((p) => p.active && p.stock > 0))
  }, [search])

  useEffect(() => {
    if (showSearch) {
      loadProducts()
    }
  }, [showSearch, loadProducts])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setShowSearch(false)
    setSearch('')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const hasInsufficientStock = cart.some(
    (item) => item.quantity > item.product.stock,
  )

  const handleConfirmSale = async () => {
    if (cart.length === 0 || hasInsufficientStock) return
    setSubmitting(true)
    try {
      await createSale(cart)
      navigate('/sales')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('sales.newSale')}
        showBack
        action={
          <button
            onClick={() => setShowSearch(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + {t('sales.addProduct')}
          </button>
        }
      />

      {/* Product search modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] flex flex-col">
            <div className="px-4 pt-4 pb-2 flex items-center gap-3">
              <input
                type="text"
                placeholder={t('sales.searchProducts')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearch('')
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {t('common.close')}
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {products.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">
                  {t('common.noResults')}
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {products.map((product) => {
                    const inCart = cart.find((c) => c.product.id === product.id)
                    return (
                      <li key={product.id}>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {product.sku} &middot; {t('products.stock')}:{' '}
                              {product.stock}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(product.price)}
                            </p>
                            {inCart && (
                              <p className="text-xs text-blue-600 mt-0.5">
                                {t('sales.inCart')}: {inCart.quantity}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="px-4 py-4">
        {cart.length === 0 ? (
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
            message={t('sales.emptyCart')}
          />
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-700">
              {t('sales.cart')}
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {cart.map((item) => {
                const subtotal = item.product.price * item.quantity
                const insufficientStock = item.quantity > item.product.stock
                return (
                  <div key={item.product.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatCurrency(item.product.price)} &times;{' '}
                          {item.quantity}
                        </p>
                        {insufficientStock && (
                          <p className="text-xs text-red-600 mt-0.5">
                            {t('sales.insufficientStock')} ({t('products.stock')}:{' '}
                            {item.product.stock})
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 shrink-0">
                        {formatCurrency(subtotal)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        &minus;
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            parseInt(e.target.value, 10) || 0,
                          )
                        }
                        className="w-14 text-center text-sm border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto p-1 text-red-500 hover:text-red-700"
                        aria-label={t('common.delete')}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t('sales.total')}
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirmSale}
              disabled={submitting || hasInsufficientStock}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? t('common.loading') : t('sales.confirmSale')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
