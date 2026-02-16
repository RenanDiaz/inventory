import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('app.name')}</h1>
        <p className="text-gray-500">Phase 3 - i18n ready</p>
      </div>
    </div>
  )
}

export { App }
