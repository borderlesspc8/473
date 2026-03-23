'use client'

import dynamic from 'next/dynamic'

const SalesChartClient = dynamic(
  () => import('@/components/dashboard/sales-chart').then((m) => m.SalesChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-muted/20" />
    ),
  }
)

export function SalesChartLazy() {
  return <SalesChartClient />
}
