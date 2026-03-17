import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Caixa, Lancamento } from '@/types'
import { POSTOS_DEMO } from './data'
import { TURNO_LABELS, FORMA_PAGAMENTO_LABELS, COMBUSTIVEL_LABELS } from '@/types'

// Exportar para Excel
export function exportarCaixasExcel(caixas: Caixa[], filename: string = 'resumo-caixas') {
  const dados = caixas.map(c => {
    const posto = POSTOS_DEMO.find(p => p.id === c.postoId)
    return {
      'Data': c.data.toLocaleDateString('pt-BR'),
      'Turno': TURNO_LABELS[c.turno],
      'Posto': posto?.nome || 'N/A',
      'Operador': c.operador,
      'Total Vendas': c.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Dinheiro': c.totalDinheiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'PIX': c.totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Crédito': c.totalCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Débito': c.totalDebito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Faturado': c.totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Diferença': c.diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Status': c.status,
    }
  })
  
  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Caixas')
  
  // Ajustar largura das colunas
  const colWidths = Object.keys(dados[0] || {}).map(() => ({ wch: 15 }))
  ws['!cols'] = colWidths
  
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportarLancamentosExcel(lancamentos: Lancamento[], filename: string = 'lancamentos') {
  const dados = lancamentos.map(l => {
    const posto = POSTOS_DEMO.find(p => p.id === l.postoId)
    return {
      'Data': l.data.toLocaleDateString('pt-BR'),
      'Turno': TURNO_LABELS[l.turno],
      'Tipo': l.tipo === 'compra' ? 'Compra' : 'Venda',
      'Posto': posto?.nome || 'N/A',
      'Combustível': COMBUSTIVEL_LABELS[l.tipoCombustivel],
      'Quantidade (L)': l.quantidade,
      'Preço Unit.': l.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Valor Total': l.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Origem/Destino': l.origem || '-',
      'Forma Pagamento': l.formaPagamento ? FORMA_PAGAMENTO_LABELS[l.formaPagamento] : '-',
      'Medidor': l.medidorEletronico || '-',
      'Margem Erro': l.margemErro ? `${l.margemErro.toFixed(1)}L` : '-',
      'Conferido': l.conferido ? 'Sim' : 'Não',
    }
  })
  
  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Lançamentos')
  
  const colWidths = Object.keys(dados[0] || {}).map(() => ({ wch: 15 }))
  ws['!cols'] = colWidths
  
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// Exportar para PDF
export function exportarFaltasCaixaPDF(caixas: Caixa[], filename: string = 'faltas-caixa') {
  const faltasCaixa = caixas.filter(c => c.diferenca < 0)
  
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Faltas de Caixa', 14, 22)
  
  // Data do relatório
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30)
  
  // Tabela
  const dados = faltasCaixa.map(c => {
    const posto = POSTOS_DEMO.find(p => p.id === c.postoId)
    return [
      c.data.toLocaleDateString('pt-BR'),
      TURNO_LABELS[c.turno],
      posto?.nome || 'N/A',
      c.operador,
      c.diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    ]
  })
  
  autoTable(doc, {
    startY: 40,
    head: [['Data', 'Turno', 'Posto', 'Operador', 'Falta']],
    body: dados,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  })
  
  // Total
  const totalFalta = faltasCaixa.reduce((acc, c) => acc + c.diferenca, 0)
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 40
  doc.setFontSize(12)
  doc.text(`Total de Faltas: ${totalFalta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 15)
  
  doc.save(`${filename}.pdf`)
}

export function exportarLancamentosPDF(lancamentos: Lancamento[], filename: string = 'lancamentos') {
  const doc = new jsPDF('landscape')
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Lançamentos de Combustíveis', 14, 22)
  
  // Data do relatório
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30)
  
  // Tabela
  const dados = lancamentos.map(l => {
    const posto = POSTOS_DEMO.find(p => p.id === l.postoId)
    return [
      l.data.toLocaleDateString('pt-BR'),
      l.tipo === 'compra' ? 'Compra' : 'Venda',
      posto?.nome || 'N/A',
      COMBUSTIVEL_LABELS[l.tipoCombustivel],
      `${l.quantidade}L`,
      l.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      l.origem || '-',
      l.conferido ? 'Sim' : 'Não',
    ]
  })
  
  autoTable(doc, {
    startY: 40,
    head: [['Data', 'Tipo', 'Posto', 'Combustível', 'Qtd', 'Valor', 'Origem', 'Conferido']],
    body: dados,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
  })
  
  // Totais
  const totalCompras = lancamentos.filter(l => l.tipo === 'compra').reduce((acc, l) => acc + l.valorTotal, 0)
  const totalVendas = lancamentos.filter(l => l.tipo === 'venda').reduce((acc, l) => acc + l.valorTotal, 0)
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 40
  
  doc.setFontSize(11)
  doc.text(`Total Compras: ${totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 10)
  doc.text(`Total Vendas: ${totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, finalY + 18)
  
  doc.save(`${filename}.pdf`)
}
