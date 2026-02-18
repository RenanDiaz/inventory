import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getConsignments } from './consignmentService'
import type { Consignment } from '@/core/db/types'

export function ConsignmentsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [consignments, setConsignments] = useState<Consignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConsignments().then((results) => {
      setConsignments(results)
      setLoading(false)
    })
  }, [])

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

  return (
    <div>
      <PageHeader
        title={t('consignments.title')}
        action={
          <button
            onClick={() => navigate('/consignments/new')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + {t('consignments.newConsignment')}
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : consignments.length === 0 ? (
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
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          }
          message={t('consignments.noConsignments')}
        />
      ) : (
        <ul className="divide-y divide-gray-200">
          {consignments.map((consignment) => (
            <li key={consignment.id}>
              <button
                onClick={() => navigate(`/consignments/${consignment.id}`)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {consignment.customer_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(consignment.created_at)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    consignment.status === 'open'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t(`consignments.status.${consignment.status}`)}
                </span>

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
