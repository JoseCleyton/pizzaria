import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Produto } from 'src/app/model/produto';
import { PedidoService } from 'src/app/services/pedido.service';
import { ItenPedido } from 'src/app/model/itemPedido';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Cliente } from 'src/app/model/cliente';
import { catchError, switchMap, debounceTime } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-inserir-pedido',
  templateUrl: './inserir-pedido.component.html',
  styleUrls: ['./inserir-pedido.component.scss']
})
export class InserirOrderComponent implements OnInit, OnDestroy {

  public itemExcluir: ItenPedido = null;
  public itensPedido: ItenPedido[] = []
  public valorPedido: number = 0
  public carregamentoPagina: boolean = false
  public mensagem: string
  public habilitarBotaoModal = true
  public produtos: Produto[] = []
  public produto: Produto
  public subjectPesquisaNomeCliente: Subject<string> = new Subject
  public pedidosPorNomeCliente: Observable<Cliente[]>
  public clientes: Cliente[]
  public clientePedido: Cliente = null
  public formularioNomeCliente: FormGroup
  public formularioInserirProduto: FormGroup

  constructor(public pedidoService: PedidoService, private estoqueService: EstoqueService, private clienteService: ClienteService) { }

  ngOnInit() {
    this.carregamentoPagina = true
    this.formularioInserirProduto = new FormGroup({
      'qtd': new FormControl(null, [Validators.required, Validators.min(1)]),
      'idProduto': new FormControl(null, [Validators.required]),
    })
    this.formularioNomeCliente = new FormGroup({
      'nomeCliente': new FormControl(null, [Validators.required, Validators.min(3)]),
      'clienteJaCadastrado': new FormControl(null),
      'observacoes': new FormControl(null, [Validators.required]),
      'telefone': new FormControl(null, [Validators.required]),
      'rua': new FormControl(null, [Validators.required]),
      'bairro': new FormControl(null, [Validators.required]),
      'numero': new FormControl(null, [Validators.required, Validators.min(1)]),
      'tipoPagamento': new FormControl(null, [Validators.required]),
      'valorPedido': new FormControl(null)
    })
    this.pedidosPorNomeCliente = this.subjectPesquisaNomeCliente.pipe(
      debounceTime(1000),
      switchMap((nome: string) => {
        if (nome.trim() === '') {
          this.clienteService.buscarTodosClientes()
            .then((clientes: Cliente[]) => {
              this.carregamentoPagina = false
              this.clientes = clientes
              return of<Cliente[]>(this.clientes)
            })
        }

        let clientesAux: Cliente[] = []

        this.clientes.filter((c: Cliente) => {
          if (c.nomeCliente.toLowerCase().match(new RegExp(nome.toLowerCase()))) {
            clientesAux.push(c)
          }
        })
        this.carregamentoPagina = false
        return of<Cliente[]>(clientesAux)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.clienteService.buscarTodosClientes()
          .then((clientes: Cliente[]) => {
            this.clientes = clientes
          })
        this.carregamentoPagina = false
        return of<Cliente[]>(this.clientes)
      })
    )

    this.pedidosPorNomeCliente.subscribe(
      (clientes: Cliente[]) => { this.clientes = clientes }
    )

    this.itensPedido = this.pedidoService.getOrderItems()
    this.valorPedido = this.pedidoService.getValorOrder()
    if (this.itensPedido.length > 0) {
      this.habilitarBotaoModal = false
    }

    this.estoqueService.getEstoque()
      .then((produtos: Produto[]) => {
        this.carregamentoPagina = false
        this.produtos = produtos
      })

  }

  public adicionarProdutoALista() {
    this.produtos.find((p: Produto) => {
      if (p.id == this.formularioInserirProduto.value.idProduto) {
        this.produto = new Produto(p.nome, p.valorUnitario)
        this.produto.id = p.id
      }
    })

    let orderItem: ItenPedido = new ItenPedido()
    orderItem.produto = this.produto
    orderItem.qtd = this.formularioInserirProduto.value.qtd


    this.valorPedido += (this.produto.valorUnitario * orderItem.qtd)

    this.formularioInserirProduto.get('qtd').reset()
    this.formularioInserirProduto.get('idProduto').reset()

    this.pedidoService.addProductOrder(orderItem, this.valorPedido)
    this.valorPedido = 0

    this.habilitarBotaoModal = false

  }
  public inserirPedido() {

    let cliente: Cliente = {
      idCliente: Math.floor(new Date().getMilliseconds() / 2).toString().replace('.', ''),
      nomeCliente: this.formularioNomeCliente.value.nomeCliente,
      telefone: this.formularioNomeCliente.value.telefone,
      rua: this.formularioNomeCliente.value.rua,
      bairro: this.formularioNomeCliente.value.bairro,
      numero: this.formularioNomeCliente.value.numero,
    }
    this.carregamentoPagina = true
    if (this.itensPedido.length > 0) {
      if (this.clientePedido == null) {
        this.pedidoService.cadastrarPedidoECliente(
          this.formularioNomeCliente.value.observacoes
          , cliente, this.formularioNomeCliente.value.tipoPagamento)
          .then(() => {
            this.clientePedido = null
            this.carregamentoPagina = false
            this.mensagem = 'Pedido Realizado com sucesso'
            this.itensPedido = this.pedidoService.getOrderItems()
            this.valorPedido = this.pedidoService.getValorOrder()

            this.formularioInserirProduto.reset()
            this.formularioNomeCliente.reset()

          })
          .catch((erro) => {
            console.log(erro)
            this.mensagem = 'Erro na solicitação do Pedido'
            this.carregamentoPagina = false

          })
      } else {
        cliente.idCliente = this.clientePedido.idCliente
        this.pedidoService.cadastrarPedido(this.formularioNomeCliente.value.observacoes
          , cliente, this.formularioNomeCliente.value.tipoPagamento)
          .then(() => {
            this.clientePedido = null
            this.carregamentoPagina = false
            this.mensagem = 'Pedido Realizado com sucesso'
            this.itensPedido = this.pedidoService.getOrderItems()
            this.valorPedido = this.pedidoService.getValorOrder()

            this.formularioInserirProduto.reset()
            this.formularioNomeCliente.reset()

          })
          .catch((erro) => {
            console.log(erro)
            this.mensagem = 'Erro na solicitação do Pedido'
            this.carregamentoPagina = false
          })
      }

    } else {
      alert('Lista de Itens Vazia. Impossível prosseguir com o Pedido !!!')
    }

  }
  public limparMensagem() {
    this.mensagem = ''
  }

  public procurarItemExcluir(id: number) {
    console.log(id)
    this.itensPedido.forEach((item) => {
      if (item.id === id) {
        this.itemExcluir = item
      }
    })

  }

  public deletarItem() {
    this.itensPedido = this.pedidoService.deleteItem(this.itemExcluir, this.valorPedido)
    if (this.pedidoService.getValorOrder() == 0) {
      this.habilitarBotaoModal = true
      this.valorPedido = 0
    }

    this.valorPedido = this.pedidoService.getValorOrder()
    this.itemExcluir = null
  }

  public buscarPorNomeCliente(nomeClient: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNomeCliente.next(nomeClient)
  }
  public limparPesquisa() {
    this.mensagem = ''
  }
  public buscarTodosClientes() {
    this.clienteService.buscarTodosClientes()
      .then((clientes: Cliente[]) => {
        this.clientes = clientes
      })
  }

  public selecionarCliente(idCliente) {
    this.clientes.filter((c: Cliente) => {
      if (c.idCliente == idCliente) {

        this.clientePedido = new Cliente()
        this.clientePedido.idCliente = c.idCliente
        this.clientePedido.nomeCliente = c.nomeCliente
        this.clientePedido.numero = c.numero
        this.clientePedido.rua = c.rua
        this.clientePedido.telefone = c.telefone
        this.clientePedido.bairro = c.bairro

        this.formularioNomeCliente.get('nomeCliente').setValue(this.clientePedido.nomeCliente)
        this.formularioNomeCliente.get('telefone').setValue(this.clientePedido.telefone)
        this.formularioNomeCliente.get('rua').setValue(this.clientePedido.rua)
        this.formularioNomeCliente.get('numero').setValue(this.clientePedido.numero)
        this.formularioNomeCliente.get('bairro').setValue(this.clientePedido.bairro)

      }
    })

  }
  ngOnDestroy() {
    this.subjectPesquisaNomeCliente.unsubscribe
  }
}


