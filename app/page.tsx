import dynamic from 'next/dynamic'
import { MetricCard } from '@/components/dashboard/metric-card'
import { SalesChartLazy } from '@/components/dashboard/sales-chart-lazy'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AlertsCard } from '@/components/dashboard/alerts-card'
import {
  DollarSign,
  Fuel,
  Store,
  AlertTriangle,
} from 'lucide-react'
import {
  calcularTotalVendasHoje,
  contarTanquesBaixos,
  POSTOS_DEMO,
  LANCAMENTOS_DEMO,
} from '@/lib/data'

export default function DashboardPage() {
  const totalVendasHoje = calcularTotalVendasHoje()
  const postosAtivos = POSTOS_DEMO.filter((p) => p.status === 'ativo').length
  const tanquesBaixos = contarTanquesBaixos()
  const lancamentosHoje = LANCAMENTOS_DEMO.filter((l) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return l.data >= hoje
  }).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Panorama geral da sua rede de postos
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Vendas Hoje"
          value={totalVendasHoje.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          subtitle={`${lancamentosHoje} lançamentos`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Postos Ativos"
          value={postosAtivos}
          subtitle={`de ${POSTOS_DEMO.length} cadastrados`}
          icon={Store}
          variant="default"
        />
        <MetricCard
          title="Total de Tanques"
          value={LANCAMENTOS_DEMO.length}
          subtitle="Lançamentos no período"
          icon={Fuel}
          variant="default"
        />
        <MetricCard
          title="Alertas Ativos"
          value={tanquesBaixos}
          subtitle="Tanques com nível baixo"
          icon={AlertTriangle}
          variant={tanquesBaixos > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChartLazy />
        </div>
        <div>
          <AlertsCard />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}
