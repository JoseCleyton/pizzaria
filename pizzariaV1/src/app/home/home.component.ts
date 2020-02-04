import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../model/pedido';
import { CaixaService } from '../services/caixa/caixa.service';
import { EstoqueService } from '../services/estoque/estoque.service';
import { Produto } from '../model/produto';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { emitirComanda } from '../utils/utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente/cliente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy {

  public pedidosPorNumeroPedido: Observable<Pedido[]>
  public pedidosPorNomeCliente: Observable<Pedido[]>
  public subjectPesquisaNumeroPedido: Subject<string> = new Subject
  public subjectPesquisaNomeCliente: Subject<string> = new Subject
  public pedidos: Pedido[]
  public carregamentoPagina: boolean

  public loadValorCaixa: boolean
  public loadPedidos: boolean
  public loadProdutos: boolean

  public valorCaixa
  public pedidosAtivos
  public pedidosTotais
  public produtosTotais
  public caixaAberto: boolean
  public carregamentoAbrirCaixa: boolean
  public mensagemAbrirCaixa: string
  public formularioAbrirCaixa: FormGroup
  public mensagemCarregamento: string

  constructor(private clientService: ClienteService, private pedidoService: PedidoService, private caixaService: CaixaService, private estoqueService: EstoqueService) {
  }

  ngOnInit() {
    this.valorCaixa = 0
    this.pedidosAtivos = 0
    this.pedidosTotais = 0
    this.produtosTotais = 0
    this.caixaAberto = true
    this.loadValorCaixa = true
    this.loadPedidos = true
    this.loadProdutos = true

    this.getValorCaixa()
    this.getPedidosAtivos()
    this.getPedidos()
    this.getProdutos()

    this.formularioAbrirCaixa = new FormGroup({
      'valorCaixa': new FormControl(null, [Validators.required])
    })

    this.caixaService.getStatusCaixa()
      .then((status: any) => {
        if (status == 'aberto') {
          this.caixaAberto = true
        } else {
          this.caixaAberto = false
        }
      })

    this.pedidosPorNumeroPedido = this.subjectPesquisaNumeroPedido.pipe(
      debounceTime(1000),
      switchMap((numero: string) => {
        if (numero.trim() === '') {
          this.carregamentoPagina = false
          this.pedidoService.getOpenOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              this.mensagemCarregamento = ''
              return of<Pedido[]>(this.pedidos)
            })


        }
        this.carregamentoPagina = false
        return this.pedidoService.searchByNumberOrder(numero)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.carregamentoPagina = false
        this.mensagemCarregamento = 'Erro ao buscar Pedidos'
        this.pedidoService.getOpenOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
          })
        return of<Pedido[]>(this.pedidos)
      })
    )

    this.pedidosPorNumeroPedido.subscribe(
      (pedidos) => { this.pedidos = pedidos }
    )

    this.pedidosPorNomeCliente = this.subjectPesquisaNomeCliente.pipe(
      debounceTime(1000),
      switchMap((nome: string) => {
        if (nome.trim() == '') {
          this.carregamentoPagina = false
          this.pedidoService.getOpenOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              this.mensagemCarregamento = ''
              return of<Pedido[]>(this.pedidos)
            })

        }
        this.carregamentoPagina = false
        return this.pedidoService.searchByNameClient(nome)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.carregamentoPagina = false
        this.mensagemCarregamento = 'Erro ao buscar Pedidos'
        this.pedidoService.getOpenOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
          })
        return of<Pedido[]>(this.pedidos)
      })
    )

    this.pedidosPorNomeCliente.subscribe(
      (pedidos) => { this.pedidos = pedidos }
    )

  }

  private getProdutos() {
    this.estoqueService.getEstoque()
      .then((produtos: Produto[]) => {
        this.produtosTotais = produtos.length
        this.loadProdutos = false
      })
  }
  private getPedidosAtivos() {
    this.pedidoService.getOpenOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidosAtivos = pedidos.length
        this.loadPedidos = false
      })
  }
  private getPedidos() {
    this.pedidoService.getOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidosTotais = pedidos.length
        this.loadPedidos = false
      })
  }
  private getValorCaixa() {
    this.loadValorCaixa = true
    this.caixaService.getValorCashier()
      .then((valorCaixa: any) => {
        this.valorCaixa = valorCaixa
        this.loadValorCaixa = false
      })

  }

  public carregarPedidos() {
    this.carregamentoPagina = true
    this.pedidoService.getOpenOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidos = pedidos
        if (this.pedidos.length <= 0) {
          this.mensagemCarregamento = 'Nenhum Pedido aberto'
        }
        this.carregamentoPagina = false
      }).catch(() => {
        this.carregamentoPagina = false
        this.mensagemCarregamento = 'Erro ao buscar Pedidos'
      })
  }

  public buscarPorNumeroPedido(numeroOrder: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNumeroPedido.next(numeroOrder)
  }


  public buscarPorNomeCliente(nomeClient: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNomeCliente.next(nomeClient)
  }


  public imprimirComanda(idPedido: string, tipo: string) {
    let documento
    let pedido: any = this.pedidos.find((p) => {
      return p.idPedido == idPedido
    })

    if (tipo == 'Delivery') {
      this.clientService.buscarTodosClientes()
        .then((cliente: Cliente[]) => {
          cliente.filter((c: Cliente) => {
            if (c.idCliente == pedido.cliente.idCliente) {
              documento = emitirComanda(pedido, c, tipo)
              let idPedidoTitulo = pedido.idPedido.toString().replace('.', ",")
              documento.save(idPedidoTitulo)
            }
          })

        })
    } else {
      documento = emitirComanda(pedido, null, tipo)
      let idPedidoTitulo = pedido.idPedido.toString().replace('.', ",")
      documento.save(idPedidoTitulo)
    }

  }

  public limparPesquisa(): void {
    this.subjectPesquisaNumeroPedido.next("")
    this.subjectPesquisaNomeCliente.next("")
    this.mensagemCarregamento = ''
  }
  public limparMensagemCaixa() {
    this.mensagemAbrirCaixa = ''
    this.carregamentoAbrirCaixa = false
  }
  public abrirCaixa() {
    this.carregamentoAbrirCaixa = true
    this.caixaService.abrirCaixa(this.formularioAbrirCaixa.value.valorCaixa)
      .then(() => {
        this.caixaAberto = true
        this.carregamentoAbrirCaixa = false
        this.mensagemAbrirCaixa = 'Caixa aberto com sucesso'
        this.getValorCaixa()
        this.formularioAbrirCaixa.reset()
      })
      .catch(() => {
        this.caixaAberto = false
        this.carregamentoAbrirCaixa = false
        this.mensagemAbrirCaixa = 'Erro ao abrir o Caixa'
      })
  }

  public fecharCaixa() {
    this.carregamentoAbrirCaixa = true
    this.caixaService.fecharCaixa()
      .then(() => {
        this.caixaAberto = false
        this.carregamentoAbrirCaixa = false
        this.mensagemAbrirCaixa = 'Caixa fechado com sucesso'
        this.getValorCaixa()
      })
      .catch(() => {
        this.carregamentoAbrirCaixa = false
        this.mensagemAbrirCaixa = 'Erro ao fechar o Caixa'
      })
  }

  ngOnDestroy() {
    this.subjectPesquisaNumeroPedido.unsubscribe
    this.subjectPesquisaNomeCliente.unsubscribe
  }
}
