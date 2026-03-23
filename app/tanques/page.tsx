'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TankGauge } from '@/components/tanks/tank-gauge'
import { TANQUES_DEMO, POSTOS_DEMO } from '@/lib/data'
import {
  COMBUSTIVEL_LABELS,
  COMBUSTIVEL_COLORS,
  type TipoCombustivel,
} from '@/types'
import { Droplet, AlertTriangle, CheckCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TanquesPage() {
  const [postoFilter, setPostoFilter] = useState<string>('all')
  const [combustivelFilter, setCombustivelFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  const combustiveis = useMemo(
    () =>
      [
        ...new Set(TANQUES_DEMO.map((t) => t.tipoCombustivel)),
      ] as TipoCombustivel[],
    []
  )

  const filteredTanques = useMemo(
    () =>
      TANQUES_DEMO.filter((tanque) => {
        const matchesPosto =
          postoFilter === 'all' || tanque.postoId === postoFilter
        const matchesCombustivel =
          combustivelFilter === 'all' ||
          tanque.tipoCombustivel === combustivelFilter
        return matchesPosto && matchesCombustivel
      }),
    [postoFilter, combustivelFilter]
  )

  const tanquesBaixos = useMemo(
    () => filteredTanques.filter((t) => t.nivelAtual / t.capacidadeTotal < 0.2),
    [filteredTanques]
  )
  const tanquesAtencao = useMemo(
    () =>
      filteredTanques.filter((t) => {
        const p = t.nivelAtual / t.capacidadeTotal
        return p >= 0.2 && p < 0.5
      }),
    [filteredTanques]
  )
  const tanquesNormais = useMemo(
    () =>
      filteredTanques.filter(
        (t) => t.nivelAtual / t.capacidadeTotal >= 0.5
      ),
    [filteredTanques]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Controle de Tanques
          </h1>
          <p className="text-muted-foreground">
            Monitore os níveis de combustível em todos os postos
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={postoFilter} onValueChange={setPostoFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos os Postos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Postos</SelectItem>
              {POSTOS_DEMO.map((posto) => (
                <SelectItem key={posto.id} value={posto.id}>
                  {posto.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={combustivelFilter} onValueChange={setCombustivelFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Todos Combustíveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Combustíveis</SelectItem>
              {combustiveis.map((comb) => (
                <SelectItem key={comb} value={comb}>
                  {COMBUSTIVEL_LABELS[comb]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tanquesNormais.length}
              </p>
              <p className="text-sm text-muted-foreground">Tanques Normais</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
              <Droplet className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tanquesAtencao.length}
              </p>
              <p className="text-sm text-muted-foreground">Requerem Atenção</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tanquesBaixos.length}
              </p>
              <p className="text-sm text-muted-foreground">Nível Crítico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'cards' | 'table')}>
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTanques.map((tanque) => (
              <TankGauge key={tanque.id} tanque={tanque} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posto</TableHead>
                    <TableHead>Combustível</TableHead>
                    <TableHead>Nível Atual</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Percentual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTanques.map((tanque) => {
                    const posto = POSTOS_DEMO.find(
                      (p) => p.id === tanque.postoId
                    )
                    const percentual =
                      (tanque.nivelAtual / tanque.capacidadeTotal) * 100
                    const status =
                      percentual > 50
                        ? { label: 'Normal', variant: 'default' as const }
                        : percentual > 20
                          ? { label: 'Atenção', variant: 'secondary' as const }
                          : {
                              label: 'Crítico',
                              variant: 'destructive' as const,
                            }

                    return (
                      <TableRow key={tanque.id}>
                        <TableCell className="font-medium">
                          {posto?.nome}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  COMBUSTIVEL_COLORS[tanque.tipoCombustivel],
                              }}
                            />
                            {COMBUSTIVEL_LABELS[tanque.tipoCombustivel]}
                          </div>
                        </TableCell>
                        <TableCell>
                          {tanque.nivelAtual.toLocaleString('pt-BR')}L
                        </TableCell>
                        <TableCell>
                          {tanque.capacidadeTotal.toLocaleString('pt-BR')}L
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  percentual > 50
                                    ? 'bg-emerald-500'
                                    : percentual > 20
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${percentual}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {percentual.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tanque.ultimaAtualizacao.toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
