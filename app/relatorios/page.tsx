'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CAIXAS_DEMO, LANCAMENTOS_DEMO, POSTOS_DEMO } from '@/lib/data'
import { TURNO_LABELS, COMBUSTIVEL_LABELS } from '@/types'
import {
  FileText,
  Download,
  TrendingDown,
  Fuel,
  CalendarIcon,
  FileSpreadsheet,
} from 'lucide-react'
import { exportarFaltasCaixaPDF, exportarLancamentosPDF, exportarCaixasExcel, exportarLancamentosExcel } from '@/lib/export'
import dynamic from 'next/dynamic'

const RelatoriosCharts = dynamic(
  () => import('@/components/relatorios/relatorios-charts'),
  {
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-muted/20" />
        <div className="h-80 animate-pulse rounded-xl bg-muted/20" />
      </div>
    ),
  }
)

export default function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [postoFilter, setPostoFilter] = useState<string>('all')

  // Faltas de caixa
  const faltasCaixa = useMemo(
    () =>
      CAIXAS_DEMO.filter((c) => {
        const matchesPosto = postoFilter === 'all' || c.postoId === postoFilter
        const inicioDay = dataInicio ? new Date(dataInicio.setHours(0, 0, 0, 0)) : null
        const fimDay = dataFim ? new Date(new Date(dataFim).setHours(23, 59, 59, 999)) : null
        const matchesData =
          (!inicioDay || c.data >= inicioDay) &&
          (!fimDay || c.data <= fimDay)
        return c.diferenca < 0 && matchesPosto && matchesData
      }),
    [postoFilter, dataInicio, dataFim]
  )

  const totalFaltas = useMemo(
    () => faltasCaixa.reduce((acc, c) => acc + c.diferenca, 0),
    [faltasCaixa]
  )

  // Lançamentos filtrados
  const lancamentosFiltrados = useMemo(
    () =>
      LANCAMENTOS_DEMO.filter((l) => {
        const matchesPosto = postoFilter === 'all' || l.postoId === postoFilter
        const inicioDay = dataInicio ? new Date(new Date(dataInicio).setHours(0, 0, 0, 0)) : null
        const fimDay = dataFim ? new Date(new Date(dataFim).setHours(23, 59, 59, 999)) : null
        const matchesData =
          (!inicioDay || l.data >= inicioDay) &&
          (!fimDay || l.data <= fimDay)
        return matchesPosto && matchesData
      }),
    [postoFilter, dataInicio, dataFim]
  )

  // Dados para gráfico de combustíveis
  const combustivelData = useMemo(
    () =>
      Object.entries(
        lancamentosFiltrados.reduce(
          (acc, l) => {
            const key = l.tipoCombustivel
            if (!acc[key]) acc[key] = { compras: 0, vendas: 0 }
            if (l.tipo === 'compra') acc[key].compras += l.quantidade
            else acc[key].vendas += l.quantidade
            return acc
          },
          {} as Record<string, { compras: number; vendas: number }>
        )
      ).map(([combustivel, data]) => ({
        name: COMBUSTIVEL_LABELS[combustivel as keyof typeof COMBUSTIVEL_LABELS],
        Compras: data.compras,
        Vendas: data.vendas,
      })),
    [lancamentosFiltrados]
  )

  // Dados para gráfico de pizza por posto
  const postoData = useMemo(
    () =>
      Object.entries(
        lancamentosFiltrados
          .filter((l) => l.tipo === 'venda')
          .reduce(
            (acc, l) => {
              const posto = POSTOS_DEMO.find((p) => p.id === l.postoId)
              const key = posto?.nome || 'Desconhecido'
              acc[key] = (acc[key] || 0) + l.valorTotal
              return acc
            },
            {} as Record<string, number>
          )
      ).map(([name, value]) => ({ name, value })),
    [lancamentosFiltrados]
  )

  const handleExportFaltasPDF = () => {
    exportarFaltasCaixaPDF(faltasCaixa, 'relatorio-faltas-caixa')
  }

  const handleExportLancamentosPDF = () => {
    exportarLancamentosPDF(lancamentosFiltrados, 'relatorio-lancamentos')
  }

  const handleExportFaltasExcel = () => {
    exportarCaixasExcel(faltasCaixa, 'faltas-caixa')
  }

  const handleExportLancamentosExcel = () => {
    exportarLancamentosExcel(lancamentosFiltrados, 'lancamentos')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere relatórios detalhados de faltas de caixa e lançamentos
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>Posto</Label>
              <Select value={postoFilter} onValueChange={setPostoFilter}>
                <SelectTrigger className="w-48">
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
            </div>
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-44 justify-start gap-2 text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {dataInicio
                      ? format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })
                      : <span className="text-muted-foreground">Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    disabled={(date) => (dataFim ? date > dataFim : false)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-44 justify-start gap-2 text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {dataFim
                      ? format(dataFim, 'dd/MM/yyyy', { locale: ptBR })
                      : <span className="text-muted-foreground">Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    disabled={(date) => (dataInicio ? date < dataInicio : false)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faltas">
        <TabsList>
          <TabsTrigger value="faltas" className="gap-2">
            <TrendingDown className="h-4 w-4" />
            Faltas de Caixa
          </TabsTrigger>
          <TabsTrigger value="combustiveis" className="gap-2">
            <Fuel className="h-4 w-4" />
            Lançamentos de Combustíveis
          </TabsTrigger>
        </TabsList>

        {/* Faltas de Caixa */}
        <TabsContent value="faltas" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Relatório de Faltas de Caixa</h2>
              <p className="text-sm text-muted-foreground">
                {faltasCaixa.length} ocorrência(s) encontrada(s)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportFaltasExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button onClick={handleExportFaltasPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total de Faltas</p>
                <p className="text-2xl font-bold text-red-500">
                  {totalFaltas.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Ocorrências</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {faltasCaixa.length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Média por Ocorrência</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {faltasCaixa.length > 0
                    ? (totalFaltas / faltasCaixa.length).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : 'R$ 0,00'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Posto</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead className="text-right">Falta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faltasCaixa.map((caixa) => {
                    const posto = POSTOS_DEMO.find((p) => p.id === caixa.postoId)
                    return (
                      <TableRow key={caixa.id}>
                        <TableCell>
                          {caixa.data.toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {TURNO_LABELS[caixa.turno]}
                          </Badge>
                        </TableCell>
                        <TableCell>{posto?.nome}</TableCell>
                        <TableCell>{caixa.operador}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-red-500">
                          {caixa.diferenca.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lançamentos de Combustíveis */}
        <TabsContent value="combustiveis" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Relatório de Lançamentos de Combustíveis
              </h2>
              <p className="text-sm text-muted-foreground">
                {lancamentosFiltrados.length} lançamento(s) no período
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportLancamentosExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button onClick={handleExportLancamentosPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Compras</p>
                <p className="text-2xl font-bold text-blue-500">
                  {lancamentosFiltrados
                    .filter((l) => l.tipo === 'compra')
                    .reduce((acc, l) => acc + l.valorTotal, 0)
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Vendas</p>
                <p className="text-2xl font-bold text-emerald-500">
                  {lancamentosFiltrados
                    .filter((l) => l.tipo === 'venda')
                    .reduce((acc, l) => acc + l.valorTotal, 0)
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Volume Total (L)</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {lancamentosFiltrados
                    .reduce((acc, l) => acc + l.quantidade, 0)
                    .toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <RelatoriosCharts combustivelData={combustivelData} postoData={postoData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
