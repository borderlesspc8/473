'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { TANQUES_DEMO } from '@/lib/data'
import { COMBUSTIVEL_LABELS, type Posto } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Custom icon for markers
const createCustomIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${isActive ? '#3b82f6' : '#6b7280'};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 22v-6h4v6M21 22v-6h-4v6M12 3v7M8 5l4-2l4 2M4 22h16M8 14h8v2H8z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14)
    }
  }, [center, map])
  
  return null
}

interface StationMapProps {
  selectedStation?: string | null
  onSelectStation?: (id: string) => void
  postos?: Posto[]
}

export function StationMap({ selectedStation, onSelectStation, postos = [] }: StationMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.55, -46.63])
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null)

  const handleFlyTo = (lat: number, lng: number) => {
    setFlyToCenter([lat, lng])
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={mapCenter}
        zoom={11}
        className="h-full w-full"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={flyToCenter} />
        
        {postos.map((posto) => {
          const tanques = TANQUES_DEMO.filter((t) => t.postoId === posto.id)
          const isSelected = selectedStation === posto.id
          
          return (
            <Marker
              key={posto.id}
              position={[posto.latitude, posto.longitude]}
              icon={createCustomIcon(posto.status === 'ativo')}
              eventHandlers={{
                click: () => {
                  onSelectStation?.(posto.id)
                  handleFlyTo(posto.latitude, posto.longitude)
                },
              }}
            >
              <Popup>
                <div className="min-w-64 p-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{posto.nome}</h3>
                    <Badge
                      variant={posto.status === 'ativo' ? 'default' : 'secondary'}
                    >
                      {posto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <p className="mb-3 text-sm text-muted-foreground">
                    {posto.endereco}, {posto.cidade} - {posto.estado}
                  </p>
                  
                  {tanques.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Níveis dos Tanques:
                      </p>
                      {tanques.map((tanque) => {
                        const percentual = (tanque.nivelAtual / tanque.capacidadeTotal) * 100
                        const color =
                          percentual > 50
                            ? 'bg-emerald-500'
                            : percentual > 20
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        
                        return (
                          <div key={tanque.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{COMBUSTIVEL_LABELS[tanque.tipoCombustivel]}</span>
                              <span>{percentual.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${color}`}
                                style={{ width: `${percentual}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Station List Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] max-h-48 w-64 overflow-auto rounded-lg border border-border bg-card/95 p-3 backdrop-blur-sm">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Ir para posto:
        </p>
        <div className="flex flex-col gap-1">
          {postos.filter((p) => p.status === 'ativo').map((posto) => (
            <Button
              key={posto.id}
              variant="ghost"
              size="sm"
              className="h-8 justify-start gap-2 text-xs"
              onClick={() => handleFlyTo(posto.latitude, posto.longitude)}
            >
              <Navigation className="h-3 w-3" />
              {posto.nome}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
