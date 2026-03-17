'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { POSTOS_DEMO, TANQUES_DEMO } from '@/lib/data'
import {
  COMBUSTIVEL_LABELS,
  TURNO_LABELS,
  FORMA_PAGAMENTO_LABELS,
  type TipoCombustivel,
  type Turno,
  type FormaPagamento,
  type TipoLancamento,
} from '@/types'
import { toast } from 'sonner'

const MARGEM_ERRO_TOLERANCIA = 5 // 5 litros

interface TransactionFormProps {
  onSubmit?: (data: FormData) => void
}

interface FormData {
  tipo: TipoLancamento
  data: string
  turno: Turno
  postoId: string
  tipoCombustivel: TipoCombustivel
  quantidade: number
  precoUnitario: number
  origem?: string
  tanqueDestinoId?: string
  formaPagamento?: FormaPagamento
  medidorEletronico?: number
  conferido: boolean
  observacoes?: string
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<TipoLancamento>('venda')
  const [postoId, setPostoId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [medidor, setMedidor] = useState('')
  const [conferido, setConferido] = useState(false)

  const tanquesDisponiveis = postoId
    ? TANQUES_DEMO.filter((t) => t.postoId === postoId)
    : []

  const margemErro = quantidade && medidor
    ? Math.abs(Number(quantidade) - Number(medidor))
    : null

  const margemOk = margemErro !== null && margemErro <= MARGEM_ERRO_TOLERANCIA

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    toast.success('Lançamento registrado com sucesso!')
    setOpen(false)
    
    // Reset form
    setTipo('venda')
    setPostoId('')
    setQuantidade('')
    setMedidor('')
    setConferido(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Lançamento de Combustível</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipo === 'venda' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setTipo('venda')}
            >
              Venda
            </Button>
            <Button
              type="button"
              variant={tipo === 'compra' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setTipo('compra')}
            >
              Compra
            </Button>
          </div>
          <input type="hidden" name="tipo" value={tipo} />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                name="data"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Turno */}
            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select name="turno" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TURNO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Posto */}
            <div className="space-y-2">
              <Label htmlFor="postoId">Posto</Label>
              <Select
                name="postoId"
                value={postoId}
                onValueChange={setPostoId}
                required
              >
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

            {/* Combustível */}
            <div className="space-y-2">
              <Label htmlFor="tipoCombustivel">Tipo de Combustível</Label>
              <Select name="tipoCombustivel" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMBUSTIVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade (Litros)</Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                step="0.1"
                min="0"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
            </div>

            {/* Preço Unitário */}
            <div className="space-y-2">
              <Label htmlFor="precoUnitario">Preço Unitário (R$)</Label>
              <Input
                id="precoUnitario"
                name="precoUnitario"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Origem (para compras) */}
            {tipo === 'compra' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem/Fornecedor</Label>
                  <Input
                    id="origem"
                    name="origem"
                    placeholder="Ex: Distribuidora ABC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanqueDestinoId">Tanque Destino</Label>
                  <Select name="tanqueDestinoId">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tanque" />
                    </SelectTrigger>
                    <SelectContent>
                      {tanquesDisponiveis.map((tanque) => (
                        <SelectItem key={tanque.id} value={tanque.id}>
                          {COMBUSTIVEL_LABELS[tanque.tipoCombustivel]} -{' '}
                          {tanque.capacidadeTotal.toLocaleString('pt-BR')}L
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Forma de Pagamento (para vendas) */}
            {tipo === 'venda' && (
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Select name="formaPagamento">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FORMA_PAGAMENTO_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Medidor Eletrônico */}
            <div className="space-y-2">
              <Label htmlFor="medidorEletronico">
                Leitura do Medidor Eletrônico (L)
              </Label>
              <Input
                id="medidorEletronico"
                name="medidorEletronico"
                type="number"
                step="0.1"
                value={medidor}
                onChange={(e) => setMedidor(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          {/* Margem de Erro */}
          {margemErro !== null && (
            <Alert
              variant={margemOk ? 'default' : 'destructive'}
              className={margemOk ? 'border-emerald-500/50 bg-emerald-500/10' : ''}
            >
              <div className="flex items-center gap-2">
                {margemOk ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  Diferença entre lançamento e medidor:{' '}
                  <strong>{margemErro.toFixed(1)}L</strong>
                  {margemOk ? (
                    <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-500">
                      Dentro da tolerância (5L)
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-2">
                      Acima da tolerância (5L)
                    </Badge>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Conferência */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="conferido"
              name="conferido"
              checked={conferido}
              onCheckedChange={(checked) => setConferido(checked as boolean)}
            />
            <Label htmlFor="conferido" className="cursor-pointer">
              Marcar como conferido
            </Label>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar Lançamento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
