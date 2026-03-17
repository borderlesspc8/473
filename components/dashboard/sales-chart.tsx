'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { calcularTotalVendasSemana } from '@/lib/data'

export function SalesChart() {
  const data = calcularTotalVendasSemana()

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Vendas dos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="data"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(value) =>
                  `R$ ${(value / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--card-foreground)' }}
                formatter={(value: number) => [
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }),
                  'Vendas',
                ]}
              />
              <Bar
                dataKey="valor"
                fill="var(--card-foreground)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
