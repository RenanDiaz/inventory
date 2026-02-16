import { useTranslation } from 'react-i18next'

export function LoadingSpinner() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">{t('common.loading')}</p>
      </div>
    </div>
  )
}
