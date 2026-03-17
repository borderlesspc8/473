'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CAIXAS_DEMO, POSTOS_DEMO } from '@/lib/data'
import { TURNO_LABELS, STATUS_CAIXA_LABELS } from '@/types'
import {
  Download,
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  CreditCard,
  Smartphone,
  Banknote,
  FileSpreadsheet,
} from 'lucide-react'
import { exportarCaixasExcel } from '@/lib/export'

export default function CaixaPage() {
  const [postoFilter, setPostoFilter] = useState<string>('all')
  const [turnoFilter, setTurnoFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const filteredCaixas = useMemo(() => {
    return CAIXAS_DEMO.filter((caixa) => {
      const matchesPosto =
        postoFilter === 'all' || caixa.postoId === postoFilter
      const matchesTurno =
        turnoFilter === 'all' || caixa.turno === turnoFilter
      const matchesStatus =
        statusFilter === 'all' || caixa.status === statusFilter
      const matchesDataInicio =
        !dataInicio || caixa.data >= new Date(dataInicio)
      const matchesDataFim =
        !dataFim || caixa.data <= new Date(dataFim + 'T23:59:59')

      return (
        matchesPosto &&
        matchesTurno &&
        matchesStatus &&
        matchesDataInicio &&
        matchesDataFim
      )
    })
  }, [postoFilter, turnoFilter, statusFilter, dataInicio, dataFim])

  const totais = useMemo(() => {
    return filteredCaixas.reduce(
      (acc, caixa) => ({
        vendas: acc.vendas + caixa.totalVendas,
        dinheiro: acc.dinheiro + caixa.totalDinheiro,
        pix: acc.pix + caixa.totalPix,
        credito: acc.credito + caixa.totalCredito,
        debito: acc.debito + caixa.totalDebito,
        faturado: acc.faturado + caixa.totalFaturado,
        diferenca: acc.diferenca + caixa.diferenca,
      }),
      {
        vendas: 0,
        dinheiro: 0,
        pix: 0,
        credito: 0,
        debito: 0,
        faturado: 0,
        diferenca: 0,
      }
    )
  }, [filteredCaixas])

  const faltasCaixa = filteredCaixas.filter((c) => c.diferenca < 0).length

  const handleExport = () => {
    exportarCaixasExcel(filteredCaixas, 'resumo-caixas')
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Resumo de Caixas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o fechamento de caixa de todos os turnos
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Vendas</p>
              <p className="text-xl font-bold text-card-foreground">
                {formatCurrency(totais.vendas)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <Banknote className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Dinheiro</p>
              <p className="text-xl font-bold text-emerald-500">
                {formatCurrency(totais.dinheiro)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cartões + PIX</p>
              <p className="text-xl font-bold text-blue-500">
                {formatCurrency(totais.credito + totais.debito + totais.pix)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                faltasCaixa > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'
              }`}
            >
              {faltasCaixa > 0 ? (
                <TrendingDown className="h-6 w-6 text-red-500" />
              ) : (
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faltas de Caixa</p>
              <p
                className={`text-xl font-bold ${
                  faltasCaixa > 0 ? 'text-red-500' : 'text-emerald-500'
                }`}
              >
                {faltasCaixa} ocorrência(s)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={postoFilter} onValueChange={setPostoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos Postos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Postos</SelectItem>
                {POSTOS_DEMO.map((posto) => (
                  <SelectItem key={posto.id} value={posto.id}>
                    {posto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={turnoFilter} onValueChange={setTurnoFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(TURNO_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(STATUS_CAIXA_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-36"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Posto</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead className="text-right">Total Vendas</TableHead>
                  <TableHead className="text-right">Dinheiro</TableHead>
                  <TableHead className="text-right">PIX</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Faturado</TableHead>
                  <TableHead className="text-right">Diferença</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCaixas.map((caixa) => {
                  const posto = POSTOS_DEMO.find(
                    (p) => p.id === caixa.postoId
                  )
                  const temFalta = caixa.diferenca < 0

                  return (
                    <TableRow
                      key={caixa.id}
                      className={temFalta ? 'bg-red-500/5' : ''}
                    >
                      <TableCell className="font-medium">
                        {caixa.data.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {TURNO_LABELS[caixa.turno]}
                        </Badge>
                      </TableCell>
                      <TableCell>{posto?.nome}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {caixa.operador}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(caixa.totalVendas)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-emerald-500">
                        {formatCurrency(caixa.totalDinheiro)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-500">
                        {formatCurrency(caixa.totalPix)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(caixa.totalCredito)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(caixa.totalDebito)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatCurrency(caixa.totalFaturado)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono font-medium ${
                          temFalta
                            ? 'text-red-500'
                            : caixa.diferenca > 0
                              ? 'text-emerald-500'
                              : ''
                        }`}
                      >
                        {caixa.diferenca > 0 && '+'}
                        {formatCurrency(caixa.diferenca)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            caixa.status === 'conferido'
                              ? 'default'
                              : caixa.status === 'fechado'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {STATUS_CAIXA_LABELS[caixa.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Totais do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Dinheiro</p>
              <p className="text-lg font-bold text-emerald-500">
                {formatCurrency(totais.dinheiro)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">PIX</p>
              <p className="text-lg font-bold text-blue-500">
                {formatCurrency(totais.pix)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Crédito</p>
              <p className="text-lg font-bold text-card-foreground">
                {formatCurrency(totais.credito)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Débito</p>
              <p className="text-lg font-bold text-card-foreground">
                {formatCurrency(totais.debito)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Faturado</p>
              <p className="text-lg font-bold text-muted-foreground">
                {formatCurrency(totais.faturado)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Diferença Total</p>
              <p
                className={`text-lg font-bold ${
                  totais.diferenca < 0
                    ? 'text-red-500'
                    : totais.diferenca > 0
                      ? 'text-emerald-500'
                      : 'text-card-foreground'
                }`}
              >
                {totais.diferenca > 0 && '+'}
                {formatCurrency(totais.diferenca)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
