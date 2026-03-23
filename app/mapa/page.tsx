'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { POSTOS_DEMO, TANQUES_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS, type Posto, type StatusPosto } from '@/types'
import { MapPin, Pencil, Plus, Search, Store, Trash2 } from 'lucide-react'

// Dynamic import to avoid SSR issues with Leaflet
const StationMap = dynamic(
  () => import('@/components/map/station-map').then((mod) => mod.StationMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    ),
  }
)

type FilterType = 'status' | 'cidade' | 'estado'

const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  status: 'Status',
  cidade: 'Cidade',
  estado: 'Estado',
}

type PostoFormState = {
  nome: string
  endereco: string
  cidade: string
  estado: string
  latitude: string
  longitude: string
  status: StatusPosto
}

const EMPTY_POSTO_FORM: PostoFormState = {
  nome: '',
  endereco: '',
  cidade: '',
  estado: '',
  latitude: '',
  longitude: '',
  status: 'ativo',
}

export default function MapaPage() {
  const [postos, setPostos] = useState<Posto[]>(POSTOS_DEMO)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('status')
  const [filterValue, setFilterValue] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPostoId, setEditingPostoId] = useState<string | null>(null)
  const [postoForm, setPostoForm] = useState<PostoFormState>(EMPTY_POSTO_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const filterOptions: Record<FilterType, { value: string; label: string }[]> = {
    status: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
    ],
    cidade: [...new Set(postos.map((p) => p.cidade))]
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ value: c, label: c })),
    estado: [...new Set(postos.map((p) => p.estado))]
      .sort((a, b) => a.localeCompare(b))
      .map((e) => ({ value: e, label: e })),
  }

  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type)
    setFilterValue('all')
  }

  const filteredPostos = postos.filter((posto) => {
    const matchesSearch =
      posto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posto.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    if (filterValue === 'all') return matchesSearch
    const matchesFilter =
      filterType === 'status'
        ? posto.status === filterValue
        : filterType === 'cidade'
          ? posto.cidade === filterValue
          : posto.estado === filterValue
    return matchesSearch && matchesFilter
  })

  const resetPostoForm = () => {
    setPostoForm(EMPTY_POSTO_FORM)
    setEditingPostoId(null)
    setFormError(null)
  }

  const openCreateDialog = () => {
    resetPostoForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (posto: Posto) => {
    setEditingPostoId(posto.id)
    setPostoForm({
      nome: posto.nome,
      endereco: posto.endereco,
      cidade: posto.cidade,
      estado: posto.estado,
      latitude: String(posto.latitude),
      longitude: String(posto.longitude),
      status: posto.status,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleFormChange = (field: keyof PostoFormState, value: string) => {
    setPostoForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSavePosto = () => {
    const nome = postoForm.nome.trim()
    const endereco = postoForm.endereco.trim()
    const cidade = postoForm.cidade.trim()
    const estado = postoForm.estado.trim().toUpperCase()
    const latitude = Number.parseFloat(postoForm.latitude)
    const longitude = Number.parseFloat(postoForm.longitude)

    if (!nome || !endereco || !cidade || !estado) {
      setFormError('Preencha nome, endereco, cidade e estado.')
      return
    }

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setFormError('Latitude e longitude precisam ser numeros validos.')
      return
    }

    setPostos((prev) => {
      if (editingPostoId) {
        return prev.map((posto) =>
          posto.id === editingPostoId
            ? {
                ...posto,
                nome,
                endereco,
                cidade,
                estado,
                latitude,
                longitude,
                status: postoForm.status,
              }
            : posto
        )
      }

      const newPosto: Posto = {
        id: Date.now().toString(),
        nome,
        endereco,
        cidade,
        estado,
        latitude,
        longitude,
        status: postoForm.status,
        createdAt: new Date(),
      }

      return [newPosto, ...prev]
    })

    setIsDialogOpen(false)
    resetPostoForm()
  }

  const handleDeletePosto = (postoId: string) => {
    const posto = postos.find((p) => p.id === postoId)
    if (!posto) return

    const confirmed = window.confirm(
      `Deseja remover o posto "${posto.nome}"? Esta acao nao pode ser desfeita.`
    )
    if (!confirmed) return

    setPostos((prev) => prev.filter((p) => p.id !== postoId))
    if (selectedStation === postoId) {
      setSelectedStation(null)
    }
  }

  const selectedPostoData = selectedStation
    ? postos.find((p) => p.id === selectedStation)
    : null
  const selectedTanques = selectedStation
    ? TANQUES_DEMO.filter((t) => t.postoId === selectedStation)
    : []

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Mapa dos Postos
          </h1>
          <p className="text-muted-foreground">
            Visualize a localização de todos os postos
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FILTER_TYPE_LABELS) as FilterType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {FILTER_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={`Todos(as)`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos(as)</SelectItem>
              {filterOptions[filterType].map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo posto
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid flex-1 gap-4 lg:grid-cols-4">
        {/* Station List */}
        <Card className="bg-card lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4" />
              Postos ({filteredPostos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[calc(100%-4rem)] overflow-auto">
            <div className="flex flex-col gap-2">
              {filteredPostos.map((posto) => (
                <div
                  key={posto.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selectedStation === posto.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStation(posto.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        posto.status === 'ativo'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {posto.nome}
                        </span>
                        <Badge
                          variant={
                            posto.status === 'ativo' ? 'default' : 'secondary'
                          }
                          className="shrink-0 text-xs"
                        >
                          {posto.status}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {posto.cidade} - {posto.estado}
                      </p>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(posto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleDeletePosto(posto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="lg:col-span-3">
          <StationMap
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            postos={filteredPostos}
          />
        </div>
      </div>

      {/* Selected Station Details */}
      {selectedPostoData && (
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {selectedPostoData.nome}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPostoData.endereco}, {selectedPostoData.cidade} -{' '}
                  {selectedPostoData.estado}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {selectedTanques.map((tanque) => {
                  const percentual =
                    (tanque.nivelAtual / tanque.capacidadeTotal) * 100
                  const color =
                    percentual > 50
                      ? 'text-emerald-500'
                      : percentual > 20
                        ? 'text-amber-500'
                        : 'text-red-500'

                  return (
                    <div key={tanque.id} className="text-center">
                      <p className="text-xs text-muted-foreground">
                        {COMBUSTIVEL_LABELS[tanque.tipoCombustivel]}
                      </p>
                      <p className={`text-lg font-bold ${color}`}>
                        {percentual.toFixed(0)}%
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetPostoForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPostoId ? 'Editar posto' : 'Adicionar novo posto'}
            </DialogTitle>
            <DialogDescription>
              Informe os dados principais do posto para manter o mapa atualizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Nome"
              value={postoForm.nome}
              onChange={(e) => handleFormChange('nome', e.target.value)}
            />
            <Input
              placeholder="Endereco"
              value={postoForm.endereco}
              onChange={(e) => handleFormChange('endereco', e.target.value)}
            />
            <Input
              placeholder="Cidade"
              value={postoForm.cidade}
              onChange={(e) => handleFormChange('cidade', e.target.value)}
            />
            <Input
              placeholder="Estado (ex: SP)"
              maxLength={2}
              value={postoForm.estado}
              onChange={(e) => handleFormChange('estado', e.target.value)}
            />
            <Input
              placeholder="Latitude"
              value={postoForm.latitude}
              onChange={(e) => handleFormChange('latitude', e.target.value)}
            />
            <Input
              placeholder="Longitude"
              value={postoForm.longitude}
              onChange={(e) => handleFormChange('longitude', e.target.value)}
            />
            <div className="sm:col-span-2">
              <Select
                value={postoForm.status}
                onValueChange={(value) =>
                  handleFormChange('status', value as StatusPosto)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && (
              <p className="sm:col-span-2 text-sm text-destructive">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                resetPostoForm()
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSavePosto}>
              {editingPostoId ? 'Salvar alteracoes' : 'Adicionar posto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
