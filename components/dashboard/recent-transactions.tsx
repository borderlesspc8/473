'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LANCAMENTOS_DEMO, POSTOS_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS, TURNO_LABELS } from '@/types'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

export function RecentTransactions() {
  const recentLancamentos = LANCAMENTOS_DEMO.slice(0, 8)

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Últimos Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {recentLancamentos.map((lancamento) => {
            const posto = POSTOS_DEMO.find((p) => p.id === lancamento.postoId)
            const isVenda = lancamento.tipo === 'venda'

            return (
              <div
                key={lancamento.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isVenda
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {isVenda ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">
                      {COMBUSTIVEL_LABELS[lancamento.tipoCombustivel]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {posto?.nome} • {TURNO_LABELS[lancamento.turno]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      isVenda ? 'text-emerald-500' : 'text-blue-500'
                    }`}
                  >
                    {isVenda ? '+' : '-'}
                    {lancamento.valorTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lancamento.quantidade}L
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
