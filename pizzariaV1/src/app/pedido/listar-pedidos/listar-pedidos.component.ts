import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/model/pedido';
import { CaixaService } from 'src/app/services/caixa/caixa.service';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';
import { Produto } from 'src/app/model/produto';
import { ItenPedido } from 'src/app/model/itemPedido';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { emitirComanda } from '../../utils/utils'
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Cliente } from 'src/app/model/cliente';

@Component({
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.scss']
})
export class ListarOrdersComponent implements OnInit, OnDestroy {
  public pedidosPorNumeroPedido: Observable<Pedido[]>
  public pedidosPorNomeCliente: Observable<Pedido[]>
  public subjectPesquisaNumeroPedido: Subject<string> = new Subject
  public subjectPesquisaNomeCliente: Subject<string> = new Subject
  public mensagemCarregamento = ''
  public pedidoVisualizar: Pedido = null
  public pedidoExcluir: Pedido = null
  public pedidoFechar: Pedido = null
  public carregamentoPagina: boolean = false
  public pedidos: Pedido[] = []
  public produtosFaltando: Produto[] = []
  public mensagemPedidoFechado: string
  public pedidoImprimir: any
  public mensagem: string
  public naoFinalizado: boolean
  public caixaAberto: boolean
  public formularioAbrirCaixa: FormGroup
  public carregamentoAbrirCaixa: boolean
  public mensagemAbrirCaixa: string

  constructor(private clienteService: ClienteService, private pedidoservice: PedidoService, private caixaService: CaixaService, private estoqueService: EstoqueService) {
  }

  ngOnInit() {

    this.formularioAbrirCaixa = new FormGroup({
      'valorCaixa': new FormControl(null, [Validators.required])
    })
    this.caixaAberto = true
    this.caixaService.getStatusCaixa()
      .then((status: string) => {
        if (status == 'aberto') {
          this.caixaAberto = true
        } else {
          this.caixaAberto = false
        }
      })
    this.naoFinalizado = false
    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Pedidos'

    this.pedidosPorNumeroPedido = this.subjectPesquisaNumeroPedido.pipe(
      debounceTime(1000),
      switchMap((numero: string) => {
        if (numero.trim() === '') {
          this.carregamentoPagina = false
          this.pedidoservice.getOpenOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              this.carregamentoPagina = false
            })
          this.carregamentoPagina = false
          return of<Pedido[]>(this.pedidos)
        }
        let pedidosAux = []
        this.pedidos.filter((p) => {
          if (p.idPedido.toString().match(new RegExp(numero))) {
            pedidosAux.push(p)
          }
        })
        this.carregamentoPagina = false
        return of<Pedido[]>(pedidosAux)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.pedidoservice.getOpenOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
            this.carregamentoPagina = false
          })
        this.carregamentoPagina = false
        return of<Pedido[]>(this.pedidos)
      })
    )

    this.pedidosPorNumeroPedido.subscribe(
      (pedidos) => { this.pedidos = pedidos }
    )

    this.pedidosPorNomeCliente = this.subjectPesquisaNomeCliente.pipe(
      debounceTime(1000),
      switchMap((nome: string) => {
        if (nome.trim() === '') {
          this.pedidoservice.getOpenOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              this.carregamentoPagina = false
            })
          this.carregamentoPagina = false
          return of<Pedido[]>(this.pedidos)
        }
        let pedidosAux = []
        this.pedidos.filter((p) => {
          if (p.cliente.nomeCliente.toLowerCase().match(new RegExp(nome.toLowerCase()))) {
            pedidosAux.push(p)
          }
        })
        this.carregamentoPagina = false
        return of<Pedido[]>(pedidosAux)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.pedidoservice.getOpenOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
            this.carregamentoPagina = false
          })
        this.carregamentoPagina = false
        return of<Pedido[]>(this.pedidos)
      })
    )

    this.pedidosPorNomeCliente.subscribe(
      (pedidos) => { this.pedidos = pedidos }
    )

    this.pedidoservice.getOpenOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidos = pedidos
        if (this.pedidos.length <= 0) {
          this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
          this.carregamentoPagina = false
        } else {

          this.carregamentoPagina = false
          this.mensagemCarregamento = ''
        }
      })
      .catch((erro) => {

        this.carregamentoPagina = false
      })
  }

  public selecionarPedidoExcluir(id: string) {

    this.pedidoExcluir = new Pedido()
    this.pedidoExcluir = this.pedidos.find((p: Pedido) => {
      return p.idPedido === id
    })

  }

  public excluirPedido() {
    let dia = new Date().getDate()
    let mes = new Date().getMonth() + 1
    let ano = new Date().getFullYear()
    let dataAtualizada = dia + '/' + mes + '/' + ano

    this.pedidoExcluir.status = 'excluido'
    this.pedidoExcluir.dataFechamento = dataAtualizada
    this.pedidoservice.updateStatusOrder(this.pedidoExcluir)
    this.pedidoservice.getOpenOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidos = pedidos
        if (this.pedidos.length <= 0) {
          this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
          this.carregamentoPagina = false
        } else {

          this.carregamentoPagina = false
          this.mensagemCarregamento = ''
        }
      })
      .catch((erro) => {
        this.mensagemCarregamento = 'Lista de Orders vazia'
      })

  }

  public selecionarPedidoFinalizar(id: string) {
    this.pedidoFechar = new Pedido()
    this.pedidoFechar = this.pedidos.find((p: Pedido) => {
      return p.idPedido === id
    })
  }
  public fecharPedido() {
    let produtosOk: Produto[] = []
    this.estoqueService.getEstoqueRastreado()
      .then((produtos: Produto[]) => {
        this.pedidoFechar.itensPedido.forEach((iten: ItenPedido) => {
          produtos.forEach((p: Produto) => {
            if (iten.produto.id == p.id) {
              if (iten.qtd > p.quantidade) {
                this.produtosFaltando.push(p)
              } else {
                produtosOk.push(p)
              }
            }
          })
        })
        if (this.produtosFaltando.length > 0) {
          this.mensagem = 'Alguns produtos não estão no estoque'
          this.naoFinalizado = true
        } else {

          produtosOk.filter((p: Produto) => {
            this.pedidoFechar.itensPedido.filter((iten: ItenPedido) => {

              if (p.id == iten.produto.id && p.quantidade != undefined) {
                p.quantidade -= iten.qtd
              }
            })
          })

          produtosOk.filter((p: Produto) => {
            if (p.quantidade != undefined) {
              this.pedidoFechar.status = 'finalizado'
              this.pedidoservice.closeOrder(this.pedidoFechar)
                .then(() => {
                  this.mensagem = 'Pedido finalizado com sucesso'
                  this.estoqueService.atualizarEstoqueRastreado(p)
                  this.pedidoservice.getOpenOrders()
                    .then((pedidos: Pedido[]) => {
                      this.pedidos = pedidos
                    })
                })
            } else {
              this.pedidoFechar.status = 'finalizado'
              this.pedidoservice.closeOrder(this.pedidoFechar)
                .then(() => {
                  this.mensagem = 'Pedido finalizado com sucesso'
                  this.estoqueService.atualizarEstoqueNaoRastreado(p)
                  this.pedidoservice.getOpenOrders()
                    .then((pedidos: Pedido[]) => {
                      this.pedidos = pedidos
                    })
                })
            }
          })
        }
      })
  }

  public visualizarPedido(id: string) {
    this.pedidoVisualizar = this.pedidos.find((p: Pedido) => {
      return p.idPedido === id
    })
  }

  public limparMensagem() {
    this.mensagemPedidoFechado = ''
    this.mensagem = ''
    this.produtosFaltando = []
    this.naoFinalizado = false
  }

  public imprimirComanda(tipo: string) {

    let documento
    if (tipo == 'Delivery') {
      this.clienteService.buscarTodosClientes()
        .then((clientes: Cliente[]) => {
          clientes.filter((c: Cliente) => {
            if (c.idCliente == this.pedidoImprimir.cliente.idCliente) {
              documento = emitirComanda(this.pedidoImprimir, c, tipo)
              let idPedidoTitulo = this.pedidoImprimir.idPedido.toString().replace('.', ",")
              documento.save(idPedidoTitulo)
            }
          })

        })
    } else {
      documento = emitirComanda(this.pedidoImprimir, null, tipo)
      let idOrderTitulo = this.pedidoImprimir.idPedido.toString().replace('.', ",")
      documento.save(idOrderTitulo)
    }
  }

  public selecionarPedidoImprimir(idOrder: string) {
    this.pedidoImprimir = this.pedidos.find((p) => {
      return p.idPedido == idOrder
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
        this.formularioAbrirCaixa.reset()
      })
      .catch(() => {
        this.caixaAberto = false
        this.carregamentoAbrirCaixa = false
        this.mensagemAbrirCaixa = 'Erro ao abrir o Caixa'
      })
  }

  ngOnDestroy() {
    this.subjectPesquisaNumeroPedido.unsubscribe
    this.subjectPesquisaNomeCliente.unsubscribe
  }
}
