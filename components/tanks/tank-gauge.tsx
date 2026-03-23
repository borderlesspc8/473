'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { COMBUSTIVEL_LABELS, COMBUSTIVEL_COLORS, type Tanque } from '@/types'
import { POSTOS_DEMO } from '@/lib/data'
import { Droplet } from 'lucide-react'

interface TankGaugeProps {
  tanque: Tanque
  showPosto?: boolean
}

export const TankGauge = memo(function TankGauge({ tanque, showPosto = true }: TankGaugeProps) {
  const percentual = (tanque.nivelAtual / tanque.capacidadeTotal) * 100
  const posto = POSTOS_DEMO.find((p) => p.id === tanque.postoId)
  
  const getStatusColor = () => {
    if (percentual > 50) return 'bg-emerald-500'
    if (percentual > 20) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getStatusBadge = () => {
    if (percentual > 50)
      return { label: 'Normal', variant: 'default' as const }
    if (percentual > 20)
      return { label: 'Atenção', variant: 'secondary' as const }
    return { label: 'Crítico', variant: 'destructive' as const }
  }

  const status = getStatusBadge()

  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${COMBUSTIVEL_COLORS[tanque.tipoCombustivel]}20` }}
            >
              <Droplet
                className="h-5 w-5"
                style={{ color: COMBUSTIVEL_COLORS[tanque.tipoCombustivel] }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {COMBUSTIVEL_LABELS[tanque.tipoCombustivel]}
              </h3>
              {showPosto && posto && (
                <p className="text-sm text-muted-foreground">{posto.nome}</p>
              )}
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-card-foreground">
              {percentual.toFixed(0)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {tanque.nivelAtual.toLocaleString('pt-BR')}L /{' '}
              {tanque.capacidadeTotal.toLocaleString('pt-BR')}L
            </span>
          </div>
          
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${getStatusColor()}`}
              style={{ width: `${percentual}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Última atualização:{' '}
            {tanque.ultimaAtualizacao.toLocaleString('pt-BR')}
          </span>
          <span>
            Disponível:{' '}
            {(tanque.capacidadeTotal - tanque.nivelAtual).toLocaleString(
              'pt-BR'
            )}
            L
          </span>
        </div>
      </CardContent>
    </Card>
  )
})
