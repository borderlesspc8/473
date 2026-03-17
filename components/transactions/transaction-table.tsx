'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { POSTOS_DEMO } from '@/lib/data'
import {
  COMBUSTIVEL_LABELS,
  TURNO_LABELS,
  FORMA_PAGAMENTO_LABELS,
  type Lancamento,
} from '@/types'
import {
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

interface TransactionTableProps {
  lancamentos: Lancamento[]
}

export function TransactionTable({ lancamentos }: TransactionTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === lancamentos.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(lancamentos.map((l) => l.id))
    }
  }

  const handleConferir = (id: string) => {
    toast.success('Lançamento marcado como conferido')
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedIds.length === lancamentos.length &&
                      lancamentos.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Posto</TableHead>
                <TableHead>Combustível</TableHead>
                <TableHead className="text-right">Qtd (L)</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Origem/Pagamento</TableHead>
                <TableHead>Medidor</TableHead>
                <TableHead>Conferência</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentos.map((lancamento) => {
                const posto = POSTOS_DEMO.find(
                  (p) => p.id === lancamento.postoId
                )
                const isVenda = lancamento.tipo === 'venda'
                const margemErro = lancamento.margemErro ?? 0
                const margemOk = margemErro <= 5

                return (
                  <TableRow
                    key={lancamento.id}
                    className={
                      selectedIds.includes(lancamento.id) ? 'bg-muted/50' : ''
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(lancamento.id)}
                        onCheckedChange={() => toggleSelect(lancamento.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {lancamento.data.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {TURNO_LABELS[lancamento.turno]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          isVenda
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {isVenda ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3" />
                        )}
                        {isVenda ? 'Venda' : 'Compra'}
                      </div>
                    </TableCell>
                    <TableCell>{posto?.nome}</TableCell>
                    <TableCell>
                      {COMBUSTIVEL_LABELS[lancamento.tipoCombustivel]}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {lancamento.quantidade.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-medium ${
                        isVenda ? 'text-emerald-500' : 'text-blue-500'
                      }`}
                    >
                      {lancamento.valorTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {isVenda
                        ? lancamento.formaPagamento
                          ? FORMA_PAGAMENTO_LABELS[lancamento.formaPagamento]
                          : '-'
                        : lancamento.origem || '-'}
                    </TableCell>
                    <TableCell>
                      {lancamento.medidorEletronico ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {lancamento.medidorEletronico.toLocaleString(
                              'pt-BR'
                            )}
                            L
                          </span>
                          {margemOk ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${
                              margemOk
                                ? 'text-emerald-500'
                                : 'text-red-500'
                            }`}
                          >
                            ({margemErro.toFixed(1)}L)
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lancamento.conferido ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500 text-emerald-500"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Conferido
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="mr-1 h-3 w-3" />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {!lancamento.conferido && (
                            <DropdownMenuItem
                              onClick={() => handleConferir(lancamento.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Marcar Conferido
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
