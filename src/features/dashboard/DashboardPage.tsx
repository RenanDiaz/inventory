import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">{t('dashboard.totalProducts')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">{t('dashboard.lowStock')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">{t('dashboard.recentSales')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">{t('dashboard.openConsignments')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
        </div>
      </div>
    </div>
  )
}
