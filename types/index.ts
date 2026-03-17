// Tipos base
export type TipoCombustivel = 
  | 'gasolina_comum' 
  | 'gasolina_aditivada' 
  | 'etanol' 
  | 'diesel' 
  | 'diesel_s10'

export type Turno = 'manha' | 'tarde' | 'noite'

export type FormaPagamento = 'dinheiro' | 'pix' | 'credito' | 'debito' | 'faturado'

export type StatusPosto = 'ativo' | 'inativo'

export type StatusCaixa = 'aberto' | 'fechado' | 'conferido'

export type StatusNotaFiscal = 'pendente' | 'processada' | 'cancelada'

export type TipoLancamento = 'compra' | 'venda'

export type TipoNotaFiscal = 'entrada' | 'saida'

// Interfaces principais
export interface Posto {
  id: string
  nome: string
  endereco: string
  cidade: string
  estado: string
  latitude: number
  longitude: number
  status: StatusPosto
  createdAt: Date
}

export interface Tanque {
  id: string
  postoId: string
  tipoCombustivel: TipoCombustivel
  capacidadeTotal: number
  nivelAtual: number
  ultimaAtualizacao: Date
}

export interface Lancamento {
  id: string
  tipo: TipoLancamento
  data: Date
  turno: Turno
  postoId: string
  tipoCombustivel: TipoCombustivel
  quantidade: number
  precoUnitario: number
  valorTotal: number
  origem?: string
  tanqueDestinoId?: string
  formaPagamento?: FormaPagamento
  medidorEletronico?: number
  conferido: boolean
  margemErro?: number
  observacoes?: string
  createdAt: Date
}

export interface Caixa {
  id: string
  postoId: string
  data: Date
  turno: Turno
  operador: string
  valorAbertura: number
  valorFechamento: number
  totalVendas: number
  totalDinheiro: number
  totalPix: number
  totalCredito: number
  totalDebito: number
  totalFaturado: number
  diferenca: number
  status: StatusCaixa
  observacoes?: string
}

export interface NotaFiscal {
  id: string
  numero: string
  postoId: string
  tipo: TipoNotaFiscal
  fornecedor?: string
  valorTotal: number
  dataEmissao: Date
  status: StatusNotaFiscal
  arquivoUrl?: string
  lancamentoId?: string
}

// Labels para exibição
export const COMBUSTIVEL_LABELS: Record<TipoCombustivel, string> = {
  gasolina_comum: 'Gasolina Comum',
  gasolina_aditivada: 'Gasolina Aditivada',
  etanol: 'Etanol',
  diesel: 'Diesel',
  diesel_s10: 'Diesel S10',
}

export const TURNO_LABELS: Record<Turno, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
}

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  faturado: 'Faturado',
}

export const STATUS_CAIXA_LABELS: Record<StatusCaixa, string> = {
  aberto: 'Aberto',
  fechado: 'Fechado',
  conferido: 'Conferido',
}

// Cores dos combustíveis para gráficos
export const COMBUSTIVEL_COLORS: Record<TipoCombustivel, string> = {
  gasolina_comum: '#3b82f6',
  gasolina_aditivada: '#8b5cf6',
  etanol: '#22c55e',
  diesel: '#f59e0b',
  diesel_s10: '#ef4444',
}
