'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Droplet, Wallet } from 'lucide-react'
import { TANQUES_DEMO, CAIXAS_DEMO, POSTOS_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS, TURNO_LABELS } from '@/types'

export const AlertsCard = memo(function AlertsCard() {
  const tanquesBaixos = TANQUES_DEMO.filter(
    (t) => t.nivelAtual / t.capacidadeTotal < 0.2
  )
  const faltasCaixa = CAIXAS_DEMO.filter((c) => c.diferenca < -50).slice(0, 5)

  const alertas = [
    ...tanquesBaixos.map((t) => {
      const posto = POSTOS_DEMO.find((p) => p.id === t.postoId)
      return {
        id: `tank-${t.id}`,
        type: 'tank' as const,
        message: `${COMBUSTIVEL_LABELS[t.tipoCombustivel]} em ${posto?.nome}`,
        detail: `${((t.nivelAtual / t.capacidadeTotal) * 100).toFixed(0)}% restante`,
        severity: 'warning' as const,
      }
    }),
    ...faltasCaixa.map((c) => {
      const posto = POSTOS_DEMO.find((p) => p.id === c.postoId)
      return {
        id: `cash-${c.id}`,
        type: 'cash' as const,
        message: `Falta de caixa em ${posto?.nome}`,
        detail: `${c.diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - ${TURNO_LABELS[c.turno]}`,
        severity: 'danger' as const,
      }
    }),
  ].slice(0, 6)

  if (alertas.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <AlertTriangle className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum alerta no momento
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Alertas</CardTitle>
        <Badge variant="destructive">{alertas.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                alerta.severity === 'danger'
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  alerta.severity === 'danger'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                {alerta.type === 'tank' ? (
                  <Droplet className="h-4 w-4" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-card-foreground">
                  {alerta.message}
                </span>
                <span className="text-xs text-muted-foreground">
                  {alerta.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
