'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { NOTAS_FISCAIS_DEMO, POSTOS_DEMO } from '@/lib/data'
import {
  Upload,
  FileText,
  Search,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

export default function NotasFiscaisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [postoFilter, setPostoFilter] = useState<string>('all')
  const [uploadOpen, setUploadOpen] = useState(false)

  const filteredNotas = NOTAS_FISCAIS_DEMO.filter((nota) => {
    const matchesSearch =
      nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'all' || nota.tipo === tipoFilter
    const matchesStatus = statusFilter === 'all' || nota.status === statusFilter
    const matchesPosto = postoFilter === 'all' || nota.postoId === postoFilter

    return matchesSearch && matchesTipo && matchesStatus && matchesPosto
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processada':
        return (
          <Badge variant="default" className="gap-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            Processada
          </Badge>
        )
      case 'pendente':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        )
      case 'cancelada':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelada
          </Badge>
        )
      default:
        return null
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Nota fiscal enviada com sucesso!')
    setUploadOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notas Fiscais</h1>
          <p className="text-muted-foreground">
            Gerencie as notas fiscais de entrada e saída
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Nota Fiscal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de Nota Fiscal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label>Arquivo (XML ou PDF)</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arraste um arquivo ou clique para selecionar
                    </p>
                    <Input
                      type="file"
                      accept=".xml,.pdf"
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Posto</Label>
                <Select name="postoId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o posto" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSTOS_DEMO.filter((p) => p.status === 'ativo').map(
                      (posto) => (
                        <SelectItem key={posto.id} value={posto.id}>
                          {posto.nome}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select name="tipo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {NOTAS_FISCAIS_DEMO.length}
                </p>
                <p className="text-xs text-muted-foreground">Total de Notas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">
                  {NOTAS_FISCAIS_DEMO.filter((n) => n.status === 'processada').length}
                </p>
                <p className="text-xs text-muted-foreground">Processadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">
                  {NOTAS_FISCAIS_DEMO.filter((n) => n.status === 'pendente').length}
                </p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {NOTAS_FISCAIS_DEMO.filter((n) => n.tipo === 'entrada').length}
                </p>
                <p className="text-xs text-muted-foreground">Entradas</p>
              </div>
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
                placeholder="Buscar por número ou fornecedor..."
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
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="processada">Processada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={postoFilter} onValueChange={setPostoFilter}>
              <SelectTrigger className="w-40">
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
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Posto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotas.map((nota) => {
                const posto = POSTOS_DEMO.find((p) => p.id === nota.postoId)
                return (
                  <TableRow key={nota.id}>
                    <TableCell className="font-mono font-medium">
                      {nota.numero}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          nota.tipo === 'entrada' ? 'default' : 'secondary'
                        }
                      >
                        {nota.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell>{posto?.nome}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {nota.fornecedor || '-'}
                    </TableCell>
                    <TableCell>
                      {nota.dataEmissao.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {nota.valorTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(nota.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
