'use client'

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { contarTanquesBaixos, contarFaltasCaixa } from '@/lib/data'

export function Header() {
  const alertas = contarTanquesBaixos() + contarFaltasCaixa()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar postos, lançamentos..."
          className="pl-9"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {alertas > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {alertas}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {contarTanquesBaixos() > 0 && (
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium text-destructive">Tanques Baixos</span>
                <span className="text-xs text-muted-foreground">
                  {contarTanquesBaixos()} tanque(s) com nível abaixo de 20%
                </span>
              </DropdownMenuItem>
            )}
            {contarFaltasCaixa() > 0 && (
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium text-destructive">Faltas de Caixa</span>
                <span className="text-xs text-muted-foreground">
                  {contarFaltasCaixa()} ocorrência(s) de falta de caixa
                </span>
              </DropdownMenuItem>
            )}
            {alertas === 0 && (
              <DropdownMenuItem disabled>
                Nenhuma notificação
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
