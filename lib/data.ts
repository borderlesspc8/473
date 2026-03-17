import type { Posto, Tanque, Lancamento, Caixa, NotaFiscal } from '@/types'

// Dados de demonstração para desenvolvimento
// Em produção, esses dados virão do Firebase Firestore

export const POSTOS_DEMO: Posto[] = [
  {
    id: '1',
    nome: 'Posto Central',
    endereco: 'Av. Brasil, 1500',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
    status: 'ativo',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    nome: 'Posto Norte',
    endereco: 'Rua das Flores, 320',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5200,
    longitude: -46.6250,
    status: 'ativo',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    nome: 'Posto Sul',
    endereco: 'Av. Paulista, 2000',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5700,
    longitude: -46.6450,
    status: 'ativo',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    nome: 'Posto Leste',
    endereco: 'Rua da Consolação, 800',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5450,
    longitude: -46.6100,
    status: 'ativo',
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '5',
    nome: 'Posto Oeste',
    endereco: 'Av. Rebouças, 1200',
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5600,
    longitude: -46.6700,
    status: 'inativo',
    createdAt: new Date('2024-04-01'),
  },
  {
    id: '6',
    nome: 'Posto Campinas',
    endereco: 'Av. Norte-Sul, 500',
    cidade: 'Campinas',
    estado: 'SP',
    latitude: -22.9064,
    longitude: -47.0616,
    status: 'ativo',
    createdAt: new Date('2024-04-15'),
  },
]

export const TANQUES_DEMO: Tanque[] = [
  // Posto Central
  { id: '1', postoId: '1', tipoCombustivel: 'gasolina_comum', capacidadeTotal: 30000, nivelAtual: 22500, ultimaAtualizacao: new Date() },
  { id: '2', postoId: '1', tipoCombustivel: 'gasolina_aditivada', capacidadeTotal: 15000, nivelAtual: 8000, ultimaAtualizacao: new Date() },
  { id: '3', postoId: '1', tipoCombustivel: 'etanol', capacidadeTotal: 20000, nivelAtual: 15000, ultimaAtualizacao: new Date() },
  { id: '4', postoId: '1', tipoCombustivel: 'diesel', capacidadeTotal: 25000, nivelAtual: 5000, ultimaAtualizacao: new Date() },
  // Posto Norte
  { id: '5', postoId: '2', tipoCombustivel: 'gasolina_comum', capacidadeTotal: 25000, nivelAtual: 20000, ultimaAtualizacao: new Date() },
  { id: '6', postoId: '2', tipoCombustivel: 'etanol', capacidadeTotal: 15000, nivelAtual: 3000, ultimaAtualizacao: new Date() },
  { id: '7', postoId: '2', tipoCombustivel: 'diesel_s10', capacidadeTotal: 20000, nivelAtual: 18000, ultimaAtualizacao: new Date() },
  // Posto Sul
  { id: '8', postoId: '3', tipoCombustivel: 'gasolina_comum', capacidadeTotal: 30000, nivelAtual: 12000, ultimaAtualizacao: new Date() },
  { id: '9', postoId: '3', tipoCombustivel: 'gasolina_aditivada', capacidadeTotal: 10000, nivelAtual: 9500, ultimaAtualizacao: new Date() },
  { id: '10', postoId: '3', tipoCombustivel: 'diesel', capacidadeTotal: 25000, nivelAtual: 4500, ultimaAtualizacao: new Date() },
  // Posto Leste
  { id: '11', postoId: '4', tipoCombustivel: 'gasolina_comum', capacidadeTotal: 20000, nivelAtual: 18000, ultimaAtualizacao: new Date() },
  { id: '12', postoId: '4', tipoCombustivel: 'etanol', capacidadeTotal: 15000, nivelAtual: 7500, ultimaAtualizacao: new Date() },
  // Posto Campinas
  { id: '13', postoId: '6', tipoCombustivel: 'gasolina_comum', capacidadeTotal: 35000, nivelAtual: 28000, ultimaAtualizacao: new Date() },
  { id: '14', postoId: '6', tipoCombustivel: 'diesel_s10', capacidadeTotal: 30000, nivelAtual: 6000, ultimaAtualizacao: new Date() },
]

// Gerar lançamentos de exemplo
function gerarLancamentosDemo(): Lancamento[] {
  const lancamentos: Lancamento[] = []
  const turnos: ('manha' | 'tarde' | 'noite')[] = ['manha', 'tarde', 'noite']
  const combustiveis: ('gasolina_comum' | 'gasolina_aditivada' | 'etanol' | 'diesel' | 'diesel_s10')[] = ['gasolina_comum', 'gasolina_aditivada', 'etanol', 'diesel', 'diesel_s10']
  const formasPagamento: ('dinheiro' | 'pix' | 'credito' | 'debito' | 'faturado')[] = ['dinheiro', 'pix', 'credito', 'debito', 'faturado']
  
  for (let i = 0; i < 50; i++) {
    const isVenda = Math.random() > 0.3
    const quantidade = Math.floor(Math.random() * 500) + 50
    const precoUnitario = isVenda ? 5.5 + Math.random() * 1.5 : 4.5 + Math.random()
    const medidor = quantidade + (Math.random() * 10 - 5) // +/- 5L
    
    const data = new Date()
    data.setDate(data.getDate() - Math.floor(Math.random() * 30))
    
    lancamentos.push({
      id: `lanc-${i + 1}`,
      tipo: isVenda ? 'venda' : 'compra',
      data,
      turno: turnos[Math.floor(Math.random() * turnos.length)],
      postoId: String(Math.floor(Math.random() * 5) + 1),
      tipoCombustivel: combustiveis[Math.floor(Math.random() * combustiveis.length)],
      quantidade,
      precoUnitario: Number(precoUnitario.toFixed(2)),
      valorTotal: Number((quantidade * precoUnitario).toFixed(2)),
      origem: isVenda ? undefined : ['Distribuidora ABC', 'Petrobras', 'Raízen', 'Ipiranga'][Math.floor(Math.random() * 4)],
      formaPagamento: isVenda ? formasPagamento[Math.floor(Math.random() * formasPagamento.length)] : undefined,
      medidorEletronico: Number(medidor.toFixed(1)),
      conferido: Math.random() > 0.3,
      margemErro: Number(Math.abs(quantidade - medidor).toFixed(1)),
      createdAt: data,
    })
  }
  
  return lancamentos.sort((a, b) => b.data.getTime() - a.data.getTime())
}

export const LANCAMENTOS_DEMO = gerarLancamentosDemo()

// Gerar caixas de exemplo
function gerarCaixasDemo(): Caixa[] {
  const caixas: Caixa[] = []
  const turnos: ('manha' | 'tarde' | 'noite')[] = ['manha', 'tarde', 'noite']
  const operadores = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza']
  
  for (let dia = 0; dia < 14; dia++) {
    for (let postoId = 1; postoId <= 4; postoId++) {
      for (const turno of turnos) {
        const totalVendas = Math.floor(Math.random() * 15000) + 5000
        const totalDinheiro = Math.floor(totalVendas * (Math.random() * 0.3 + 0.1))
        const totalPix = Math.floor(totalVendas * (Math.random() * 0.3 + 0.1))
        const totalCredito = Math.floor(totalVendas * (Math.random() * 0.25 + 0.1))
        const totalDebito = Math.floor(totalVendas * (Math.random() * 0.2 + 0.05))
        const totalFaturado = totalVendas - totalDinheiro - totalPix - totalCredito - totalDebito
        
        const valorAbertura = Math.floor(Math.random() * 500) + 200
        const diferenca = Math.floor(Math.random() * 200) - 100 // -100 a +100
        const valorFechamento = valorAbertura + totalDinheiro + diferenca
        
        const data = new Date()
        data.setDate(data.getDate() - dia)
        
        caixas.push({
          id: `caixa-${dia}-${postoId}-${turno}`,
          postoId: String(postoId),
          data,
          turno,
          operador: operadores[Math.floor(Math.random() * operadores.length)],
          valorAbertura,
          valorFechamento,
          totalVendas,
          totalDinheiro,
          totalPix,
          totalCredito,
          totalDebito,
          totalFaturado: Math.max(0, totalFaturado),
          diferenca,
          status: dia > 2 ? 'conferido' : dia > 0 ? 'fechado' : 'aberto',
        })
      }
    }
  }
  
  return caixas.sort((a, b) => b.data.getTime() - a.data.getTime())
}

export const CAIXAS_DEMO = gerarCaixasDemo()

// Notas fiscais de exemplo
export const NOTAS_FISCAIS_DEMO: NotaFiscal[] = [
  { id: '1', numero: 'NF-001234', postoId: '1', tipo: 'entrada', fornecedor: 'Distribuidora ABC', valorTotal: 125000, dataEmissao: new Date('2024-03-10'), status: 'processada' },
  { id: '2', numero: 'NF-001235', postoId: '2', tipo: 'entrada', fornecedor: 'Petrobras', valorTotal: 98500, dataEmissao: new Date('2024-03-11'), status: 'processada' },
  { id: '3', numero: 'NF-001236', postoId: '1', tipo: 'entrada', fornecedor: 'Raízen', valorTotal: 156000, dataEmissao: new Date('2024-03-12'), status: 'pendente' },
  { id: '4', numero: 'NF-001237', postoId: '3', tipo: 'entrada', fornecedor: 'Ipiranga', valorTotal: 87000, dataEmissao: new Date('2024-03-13'), status: 'pendente' },
  { id: '5', numero: 'NF-001238', postoId: '4', tipo: 'saida', valorTotal: 45000, dataEmissao: new Date('2024-03-14'), status: 'processada' },
]

// Funções auxiliares
export function getPostoById(id: string): Posto | undefined {
  return POSTOS_DEMO.find(p => p.id === id)
}

export function getTanquesByPosto(postoId: string): Tanque[] {
  return TANQUES_DEMO.filter(t => t.postoId === postoId)
}

export function getLancamentosByPosto(postoId: string): Lancamento[] {
  return LANCAMENTOS_DEMO.filter(l => l.postoId === postoId)
}

export function getCaixasByPosto(postoId: string): Caixa[] {
  return CAIXAS_DEMO.filter(c => c.postoId === postoId)
}

// Cálculos para dashboard
export function calcularTotalVendasHoje(): number {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  return LANCAMENTOS_DEMO
    .filter(l => l.tipo === 'venda' && l.data >= hoje)
    .reduce((acc, l) => acc + l.valorTotal, 0)
}

export function calcularTotalVendasSemana(): { data: string; valor: number }[] {
  const resultado: { data: string; valor: number }[] = []
  
  for (let i = 6; i >= 0; i--) {
    const data = new Date()
    data.setDate(data.getDate() - i)
    data.setHours(0, 0, 0, 0)
    
    const proximoDia = new Date(data)
    proximoDia.setDate(proximoDia.getDate() + 1)
    
    const vendas = LANCAMENTOS_DEMO
      .filter(l => l.tipo === 'venda' && l.data >= data && l.data < proximoDia)
      .reduce((acc, l) => acc + l.valorTotal, 0)
    
    resultado.push({
      data: data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
      valor: vendas,
    })
  }
  
  return resultado
}

export function contarTanquesBaixos(): number {
  return TANQUES_DEMO.filter(t => (t.nivelAtual / t.capacidadeTotal) < 0.2).length
}

export function contarFaltasCaixa(): number {
  return CAIXAS_DEMO.filter(c => c.diferenca < -50).length
}
