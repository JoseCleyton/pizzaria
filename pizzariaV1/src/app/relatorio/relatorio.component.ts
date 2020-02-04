import { Component, OnInit } from '@angular/core';
import { Pedido } from '../model/pedido';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
  public relatorioPedidos: Pedido[]
  public relatorioPedidosAux: Pedido[]
  public carregamentoPagina: boolean
  public mensagemCarregamento: string
  public mensagem: string
  public valorEmDebito: number
  public valorEmCredito: number
  public valorEmDinheiro: number


  constructor(private pedidoService: PedidoService) {
  }

  ngOnInit() {

    this.valorEmDebito = 0
    this.valorEmCredito = 0
    this.valorEmDinheiro = 0

    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Relatório'

    this.pedidoService.getCompletedOrders()
      .then((pedidos: Pedido[]) => {
        this.carregamentoPagina = false
        this.mensagemCarregamento = ''
        this.relatorioPedidos = pedidos
        this.relatorioPedidosAux = pedidos

        this.relatorioPedidos.filter((r: Pedido) => {
          if (r.tipoPagamento == 'debito') {
            this.valorEmDebito += r.valorPedido
          }
          if (r.tipoPagamento == 'credito') {
            this.valorEmCredito += r.valorPedido
          }
          if (r.tipoPagamento == 'dinheiro') {
            this.valorEmDinheiro += r.valorPedido
          }
        })
      })
  }

  public filtrarPorDebito() {
    this.carregamentoPagina = true
    this.relatorioPedidos = this.relatorioPedidosAux.filter((r: Pedido) => {
      return r.tipoPagamento == 'debito'
    })
    this.carregamentoPagina = false
  }

  public filtrarPorCredito() {
    this.carregamentoPagina = true
    this.relatorioPedidos = this.relatorioPedidosAux.filter((r: Pedido) => {
      return r.tipoPagamento == 'credito'
    })
    this.carregamentoPagina = false
  }
  public filtrarPorDinheiro() {
    this.carregamentoPagina = true
    this.relatorioPedidos = this.relatorioPedidosAux.filter((r: Pedido) => {
      return r.tipoPagamento == 'dinheiro'
    })
    this.carregamentoPagina = false
  }
  public limparMensagem() {
    this.mensagem = ''
  }

}
