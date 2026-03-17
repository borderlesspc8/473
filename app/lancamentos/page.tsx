'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionTable } from '@/components/transactions/transaction-table'
import { LANCAMENTOS_DEMO, POSTOS_DEMO } from '@/lib/data'
import {
  COMBUSTIVEL_LABELS,
  TURNO_LABELS,
  type TipoCombustivel,
  type Turno,
} from '@/types'
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react'
import { exportarLancamentosExcel } from '@/lib/export'

export default function LancamentosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [postoFilter, setPostoFilter] = useState<string>('all')
  const [combustivelFilter, setCombustivelFilter] = useState<string>('all')
  const [turnoFilter, setTurnoFilter] = useState<string>('all')
  const [conferidoFilter, setConferidoFilter] = useState<string>('all')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const filteredLancamentos = useMemo(() => {
    return LANCAMENTOS_DEMO.filter((lancamento) => {
      const posto = POSTOS_DEMO.find((p) => p.id === lancamento.postoId)
      
      const matchesSearch =
        posto?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        COMBUSTIVEL_LABELS[lancamento.tipoCombustivel]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      
      const matchesTipo =
        tipoFilter === 'all' || lancamento.tipo === tipoFilter
      
      const matchesPosto =
        postoFilter === 'all' || lancamento.postoId === postoFilter
      
      const matchesCombustivel =
        combustivelFilter === 'all' ||
        lancamento.tipoCombustivel === combustivelFilter
      
      const matchesTurno =
        turnoFilter === 'all' || lancamento.turno === turnoFilter
      
      const matchesConferido =
        conferidoFilter === 'all' ||
        (conferidoFilter === 'conferido' && lancamento.conferido) ||
        (conferidoFilter === 'pendente' && !lancamento.conferido)
      
      const matchesDataInicio =
        !dataInicio || lancamento.data >= new Date(dataInicio)
      
      const matchesDataFim =
        !dataFim || lancamento.data <= new Date(dataFim + 'T23:59:59')

      return (
        matchesSearch &&
        matchesTipo &&
        matchesPosto &&
        matchesCombustivel &&
        matchesTurno &&
        matchesConferido &&
        matchesDataInicio &&
        matchesDataFim
      )
    })
  }, [
    searchTerm,
    tipoFilter,
    postoFilter,
    combustivelFilter,
    turnoFilter,
    conferidoFilter,
    dataInicio,
    dataFim,
  ])

  const totalCompras = filteredLancamentos
    .filter((l) => l.tipo === 'compra')
    .reduce((acc, l) => acc + l.valorTotal, 0)
  
  const totalVendas = filteredLancamentos
    .filter((l) => l.tipo === 'venda')
    .reduce((acc, l) => acc + l.valorTotal, 0)

  const handleExport = () => {
    exportarLancamentosExcel(filteredLancamentos, 'lancamentos-combustivel')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lançamentos</h1>
          <p className="text-muted-foreground">
            Gerencie compras e vendas de combustíveis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <TransactionForm />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <ArrowDownLeft className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Compras</p>
              <p className="text-xl font-bold text-blue-500">
                {totalCompras.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <ArrowUpRight className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Vendas</p>
              <p className="text-xl font-bold text-emerald-500">
                {totalVendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Registros</p>
              <p className="text-xl font-bold text-card-foreground">
                {filteredLancamentos.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="compra">Compra</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
              </SelectContent>
            </Select>

            <Select value={postoFilter} onValueChange={setPostoFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Posto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {POSTOS_DEMO.map((posto) => (
                  <SelectItem key={posto.id} value={posto.id}>
                    {posto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={combustivelFilter} onValueChange={setCombustivelFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(COMBUSTIVEL_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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

            <Select value={conferidoFilter} onValueChange={setConferidoFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Conferência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="conferido">Conferidos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-36"
                placeholder="Data Início"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-36"
                placeholder="Data Fim"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <TransactionTable lancamentos={filteredLancamentos} />
    </div>
  )
}
