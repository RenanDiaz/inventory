import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getProduct, createProduct, updateProduct } from './productService'

interface ProductFormData {
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  min_stock: number
  active: boolean
}

function useProductSchema() {
  const { t } = useTranslation()

  return z.object({
    name: z.string().min(1, t('products.validation.nameRequired')),
    sku: z.string().min(1, t('products.validation.skuRequired')),
    price: z.number().positive(t('products.validation.priceMin')),
    cost: z.number().min(0, t('products.validation.costMin')),
    stock: z.number().int().min(0, t('products.validation.stockMin')),
    min_stock: z.number().int().min(0, t('products.validation.minStockMin')),
    active: z.boolean(),
  })
}

export function ProductFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(isEdit)
  const schema = useProductSchema()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      min_stock: 0,
      active: true,
    },
  })

  useEffect(() => {
    if (id) {
      getProduct(id).then((product) => {
        if (product) {
          reset({
            name: product.name,
            sku: product.sku,
            price: product.price,
            cost: product.cost,
            stock: product.stock,
            min_stock: product.min_stock,
            active: product.active,
          })
        }
        setLoading(false)
      })
    }
  }, [id, reset])

  const onSubmit = async (data: ProductFormData) => {
    if (isEdit && id) {
      const { stock: _stock, ...updateData } = data
      await updateProduct(id, updateData)
    } else {
      await createProduct({
        ...data,
        organization_id: 'default',
      })
    }
    navigate('/products')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title={isEdit ? t('products.editProduct') : t('products.newProduct')}
        showBack
      />

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-4 space-y-4">
        <Field label={t('products.name')} error={errors.name?.message}>
          <input
            {...register('name')}
            type="text"
            className="input"
            autoFocus
          />
        </Field>

        <Field label={t('products.sku')} error={errors.sku?.message}>
          <input {...register('sku')} type="text" className="input" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('products.price')} error={errors.price?.message}>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="input"
            />
          </Field>

          <Field label={t('products.cost')} error={errors.cost?.message}>
            <input
              {...register('cost', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('products.stock')} error={errors.stock?.message}>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              min="0"
              className="input"
              disabled={isEdit}
            />
          </Field>

          <Field label={t('products.minStock')} error={errors.min_stock?.message}>
            <input
              {...register('min_stock', { valueAsNumber: true })}
              type="number"
              min="0"
              className="input"
            />
          </Field>
        </div>

        {isEdit && (
          <p className="text-xs text-gray-500">{t('products.stockEditHint')}</p>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            {...register('active')}
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{t('products.active')}</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
