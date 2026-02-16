import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function FloatingActionButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <button
      onClick={() => navigate('/sales/new')}
      className="fixed right-4 bottom-20 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors active:scale-95"
      aria-label={t('sales.newSale')}
    >
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  )
}
