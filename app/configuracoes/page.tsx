'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { POSTOS_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS, TURNO_LABELS, type Turno } from '@/types'
import {
  Store,
  Fuel,
  Clock,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Settings2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ConfiguracoesPage() {
  const [postosDialogOpen, setPostosDialogOpen] = useState(false)
  const [turnosConfig, setTurnosConfig] = useState<Record<Turno, { inicio: string; fim: string }>>({
    manha: { inicio: '06:00', fim: '14:00' },
    tarde: { inicio: '14:00', fim: '22:00' },
    noite: { inicio: '22:00', fim: '06:00' },
  })

  useEffect(() => {
    const savedConfig = localStorage.getItem('turnos-config')
    if (!savedConfig) return

    try {
      const parsed = JSON.parse(savedConfig) as Record<Turno, { inicio: string; fim: string }>
      if (parsed?.manha && parsed?.tarde && parsed?.noite) {
        setTurnosConfig(parsed)
      }
    } catch {
      // Ignore invalid data and keep default settings.
    }
  }, [])

  const handleSavePosto = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Posto salvo com sucesso!')
    setPostosDialogOpen(false)
  }

  const handleTurnoChange = (
    turno: Turno,
    field: 'inicio' | 'fim',
    value: string
  ) => {
    setTurnosConfig((prev) => ({
      ...prev,
      [turno]: {
        ...prev[turno],
        [field]: value,
      },
    }))
  }

  const handleSaveTurnos = () => {
    localStorage.setItem('turnos-config', JSON.stringify(turnosConfig))
    toast.success('Configurações de turnos salvas com sucesso!')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie postos, combustíveis e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="postos">
        <TabsList>
          <TabsTrigger value="postos" className="gap-2">
            <Store className="h-4 w-4" />
            Postos
          </TabsTrigger>
          <TabsTrigger value="combustiveis" className="gap-2">
            <Fuel className="h-4 w-4" />
            Combustíveis
          </TabsTrigger>
          <TabsTrigger value="turnos" className="gap-2">
            <Clock className="h-4 w-4" />
            Turnos
          </TabsTrigger>
          <TabsTrigger value="sistema" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Postos */}
        <TabsContent value="postos" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Gestão de Postos</h2>
              <p className="text-sm text-muted-foreground">
                Cadastre e gerencie os postos da rede
              </p>
            </div>
            <Dialog open={postosDialogOpen} onOpenChange={setPostosDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Posto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Cadastrar Posto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSavePosto} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Posto</Label>
                    <Input id="nome" placeholder="Ex: Posto Central" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      placeholder="Ex: Av. Brasil, 1500"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="São Paulo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select name="estado" required>
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        placeholder="-23.5505"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        placeholder="-46.6333"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPostosDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {POSTOS_DEMO.map((posto) => (
                    <TableRow key={posto.id}>
                      <TableCell className="font-medium">{posto.nome}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {posto.endereco}
                      </TableCell>
                      <TableCell>
                        {posto.cidade}/{posto.estado}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {posto.latitude.toFixed(4)}, {posto.longitude.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            posto.status === 'ativo' ? 'default' : 'secondary'
                          }
                        >
                          {posto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combustíveis */}
        <TabsContent value="combustiveis" className="mt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Tipos de Combustível</h2>
            <p className="text-sm text-muted-foreground">
              Configure os tipos de combustível disponíveis
            </p>
          </div>

          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Combustível</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(COMBUSTIVEL_LABELS).map(([codigo, nome]) => (
                    <TableRow key={codigo}>
                      <TableCell className="font-medium">{nome}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {codigo}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turnos */}
        <TabsContent value="turnos" className="mt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Configuração de Turnos</h2>
            <p className="text-sm text-muted-foreground">
              Defina os horários de cada turno de operação
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(['manha', 'tarde', 'noite'] as Turno[]).map((turno) => {
              const descricaoPorTurno: Record<Turno, string> = {
                manha: 'Primeiro turno do dia',
                tarde: 'Segundo turno do dia',
                noite: 'Terceiro turno do dia',
              }

              return (
                <Card key={turno} className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Turno {TURNO_LABELS[turno]}</CardTitle>
                    <CardDescription>{descricaoPorTurno[turno]}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${turno}-inicio`}>Início</Label>
                        <Input
                          id={`${turno}-inicio`}
                          type="time"
                          value={turnosConfig[turno].inicio}
                          onChange={(e) => handleTurnoChange(turno, 'inicio', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${turno}-fim`}>Fim</Label>
                        <Input
                          id={`${turno}-fim`}
                          type="time"
                          value={turnosConfig[turno].fim}
                          onChange={(e) => handleTurnoChange(turno, 'fim', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button onClick={handleSaveTurnos}>Salvar Configurações de Turnos</Button>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="sistema" className="mt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Configurações do Sistema</h2>
            <p className="text-sm text-muted-foreground">
              Ajustes gerais e preferências
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Validações</CardTitle>
                <CardDescription>
                  Configure regras de validação do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Margem de erro do medidor</p>
                    <p className="text-sm text-muted-foreground">
                      Tolerância para conferência do medidor eletrônico
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="5"
                      className="w-20"
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground">litros</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alerta de tanque baixo</p>
                    <p className="text-sm text-muted-foreground">
                      Percentual para exibir alerta de nível crítico
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="20"
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Notificações</CardTitle>
                <CardDescription>
                  Configure alertas e notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alerta de tanque baixo</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando tanque atingir nível crítico
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alerta de falta de caixa</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando houver diferença no caixa
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relatório diário</p>
                    <p className="text-sm text-muted-foreground">
                      Enviar resumo diário por email
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Conexão Firebase</CardTitle>
                <CardDescription>
                  Status da conexão com o banco de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">
                    Firebase não configurado. Configure as variáveis de ambiente
                    para habilitar a persistência de dados.
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-muted/50 p-4">
                  <p className="mb-2 text-sm font-medium">
                    Variáveis necessárias:
                  </p>
                  <code className="text-xs text-muted-foreground">
                    NEXT_PUBLIC_FIREBASE_API_KEY
                    <br />
                    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
                    <br />
                    NEXT_PUBLIC_FIREBASE_PROJECT_ID
                    <br />
                    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
                    <br />
                    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
                    <br />
                    NEXT_PUBLIC_FIREBASE_APP_ID
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
