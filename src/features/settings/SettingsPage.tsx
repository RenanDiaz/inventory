import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { useUIStore } from '@/stores/uiStore'
import { runSync } from '@/core/sync'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { isOnline, syncStatus, lastSyncTime } = useUIStore()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const handleSync = () => {
    runSync()
  }

  const formatLastSync = (time: string | null): string => {
    if (!time) return t('settings.never')
    return new Date(time).toLocaleString(i18n.language)
  }

  return (
    <div>
      <PageHeader title={t('settings.title')} />
      <div className="p-4 space-y-6">
        {/* Language */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-3">{t('settings.language')}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('settings.languages.en')}
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                i18n.language === 'es'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('settings.languages.es')}
            </button>
          </div>
        </section>

        {/* Sync */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-3">{t('settings.sync')}</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {isOnline ? t('settings.online') : t('settings.offline')}
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
            />
          </div>
          {syncStatus === 'success' && (
            <p className="text-xs text-green-600 mb-2">{t('settings.syncSuccess')}</p>
          )}
          {syncStatus === 'error' && (
            <p className="text-xs text-red-600 mb-2">{t('settings.syncError')}</p>
          )}
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {syncStatus === 'syncing' ? t('settings.syncing') : t('settings.syncNow')}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            {t('settings.lastSync')}: {formatLastSync(lastSyncTime)}
          </p>
        </section>
      </div>
    </div>
  )
}
