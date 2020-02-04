import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/model/pedido';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-listar-todos-pedidos',
  templateUrl: './listar-todos-pedidos.component.html',
  styleUrls: ['./listar-todos-pedidos.component.scss']
})
export class ListarTodosOrdersComponent implements OnInit, OnDestroy {
  public pedidosPorNumeroPedido: Observable<Pedido[]>
  public pedidosPorNomeCliente: Observable<Pedido[]>
  public subjectPesquisaNumeroPedido: Subject<string> = new Subject
  public subjectPesquisaNomeCliente: Subject<string> = new Subject
  public mensagemCarregamento = ''
  public pedidoVisualizar: Pedido = null
  public carregamentoPagina: boolean = false
  public pedidos: Pedido[] = []

  constructor(private pedidoService: PedidoService) { }

  ngOnInit() {

    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Pedidos'

    this.pedidosPorNumeroPedido = this.subjectPesquisaNumeroPedido.pipe(
      debounceTime(1000),
      switchMap((numero: string) => {
        if (numero.trim() === '') {
          this.carregamentoPagina = false
          this.pedidoService.getOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              return of<Pedido[]>(this.pedidos)
            })
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
        this.pedidoService.getOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
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
          this.carregamentoPagina = false
          this.pedidoService.getOrders()
            .then((pedidos: Pedido[]) => {
              this.pedidos = pedidos
              return of<Pedido[]>(this.pedidos)
            })
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
        this.carregamentoPagina = false
        this.pedidoService.getOrders()
          .then((pedidos: Pedido[]) => {
            this.pedidos = pedidos
          })
        return of<Pedido[]>(this.pedidos)
      })
    )

    this.pedidosPorNomeCliente.subscribe(
      (pedidos) => { this.pedidos = pedidos }
    )

    this.pedidoService.getOrders()
      .then((pedidos: Pedido[]) => {
        this.pedidos = pedidos
        if (this.pedidos.length <= 0) {
          this.mensagemCarregamento = 'Nenhum Pedido'
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


  public visualizarPedido(id: string) {
    this.pedidoVisualizar = this.pedidos.find((p: Pedido) => {
      return p.idPedido === id
    })
  }

  public buscarPorNumeroPedido(numeroPedido: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNumeroPedido.next(numeroPedido)
  }
  public buscarPorNomeCliente(nomeCliente: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNomeCliente.next(nomeCliente)
  }

  ngOnDestroy() {
    this.subjectPesquisaNumeroPedido.unsubscribe
    this.subjectPesquisaNomeCliente.unsubscribe
  }

}
