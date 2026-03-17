'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { POSTOS_DEMO, TANQUES_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS } from '@/types'
import { MapPin, Search, Store } from 'lucide-react'

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

export default function MapaPage() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cidadeFilter, setCidadeFilter] = useState<string>('all')

  const cidades = [...new Set(POSTOS_DEMO.map((p) => p.cidade))]

  const filteredPostos = POSTOS_DEMO.filter((posto) => {
    const matchesSearch =
      posto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posto.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || posto.status === statusFilter
    const matchesCidade =
      cidadeFilter === 'all' || posto.cidade === cidadeFilter

    return matchesSearch && matchesStatus && matchesCidade
  })

  const selectedPostoData = selectedStation
    ? POSTOS_DEMO.find((p) => p.id === selectedStation)
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {cidades.map((cidade) => (
                <SelectItem key={cidade} value={cidade}>
                  {cidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <button
                  key={posto.id}
                  onClick={() => setSelectedStation(posto.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selectedStation === posto.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="lg:col-span-3">
          <StationMap
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
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
    </div>
  )
}
