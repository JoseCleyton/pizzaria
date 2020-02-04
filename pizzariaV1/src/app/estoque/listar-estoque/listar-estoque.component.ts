import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';
import { Produto } from 'src/app/model/produto';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-estoque',
  templateUrl: './listar-estoque.component.html',
  styleUrls: ['./listar-estoque.component.scss']
})
export class ListarEstoqueComponent implements OnInit, OnDestroy {

  public pesquisaPedidosPorNomeProduto: Observable<Produto[]>
  public subjectPesquisaNomeProduto: Subject<string> = new Subject
  public carregamentoPagina: boolean = false
  public carregamentoAtualizar: boolean = false
  public mensagemCarregamento: string
  public mensagem: string
  public produto: Produto
  public produtos: Produto[]
  public produtoVisualizar: Produto
  public mostrarQtd: boolean
  public formularioAtualizarProduto: FormGroup

  constructor(private estoqueService: EstoqueService) { }

  ngOnInit() {

    this.mensagemCarregamento = 'Aguarde... Buscando todos os Produtos'
    this.carregamentoPagina = true
    this.produtos = []
    this.mensagem = ''

    this.formularioAtualizarProduto = new FormGroup({
      'valorUnitario': new FormControl(null, [Validators.required, Validators.min(1)]),
      'nomeProduto': new FormControl(null, [Validators.required, Validators.min(2)]),
      'quantidade': new FormControl()
    })

    this.pesquisaPedidosPorNomeProduto = this.subjectPesquisaNomeProduto.pipe(
      debounceTime(1000),
      switchMap((nome: string) => {
        if (nome.trim() === '') {
          this.estoqueService.getEstoque()
            .then((Orders: Produto[]) => {
              this.produtos = Orders
            })
          this.carregamentoPagina = false
          return of<Produto[]>(this.produtos)
        }
        let produtosAux = []
        this.produtos.filter((p: Produto) => {
          if (p.nome.toLowerCase().match(new RegExp(nome.toLowerCase()))) {
            produtosAux.push(p)
          }
        })
        this.carregamentoPagina = false
        return of<Produto[]>(produtosAux)

      }),
      catchError((erro: any) => {
        console.log(erro.status)
        this.estoqueService.getEstoque()
          .then((produtos: Produto[]) => {
            this.produtos = produtos
          })
        this.carregamentoPagina = false
        return of<Produto[]>(this.produtos)
      })
    )

    this.estoqueService.getEstoque()
      .then((produtos: Produto[]) => {
        this.produtos = produtos
        if (this.produtos.length <= 0) {
          this.mensagemCarregamento = 'Estoque vazio'
          this.carregamentoPagina = false
        } else {
          this.carregamentoPagina = false
          this.mensagemCarregamento = ''
        }
      })
      .catch((erro) => {
        this.carregamentoPagina = false
        console.log(erro)
        this.mensagemCarregamento = 'Erro na solicitação'
      })

    this.pesquisaPedidosPorNomeProduto.subscribe(
      (produtos) => { this.produtos = produtos }
    )
  }

  public limparMensagem() {
    this.mensagem = ''
    this.mostrarQtd = false
  }

  public visualizarProduto(idProduto: number) {
    this.produtoVisualizar = this.produtos.find((produto) => {
      return produto.id === idProduto
    })

    this.formularioAtualizarProduto.get('nomeProduto').setValue(this.produtoVisualizar.nome)
    this.formularioAtualizarProduto.get('valorUnitario').setValue(this.produtoVisualizar.valorUnitario)
    this.formularioAtualizarProduto.get('quantidade').setValue(this.produtoVisualizar.quantidade)
  }

  public atualizarProduto() {
    let produtoAtualizar: Produto = new Produto(this.produtoVisualizar.nome, this.produtoVisualizar.valorUnitario)
    produtoAtualizar.id = this.produtoVisualizar.id
    produtoAtualizar.tipo = this.produtoVisualizar.tipo
    produtoAtualizar.nome = this.formularioAtualizarProduto.value.nomeProduto
    produtoAtualizar.valorUnitario = this.formularioAtualizarProduto.value.valorUnitario

    if (this.mostrarQtd || this.formularioAtualizarProduto.value.quantidade != undefined) {
      produtoAtualizar.quantidade = this.formularioAtualizarProduto.value.quantidade
      this.carregamentoAtualizar = true
      this.estoqueService.atualizarEstoqueRastreado(produtoAtualizar)
        .then(() => {
          this.carregamentoAtualizar = false
          this.mensagem = 'Produto atualizado com sucesso'
          this.estoqueService.getEstoque()
            .then((produtos: Produto[]) => {
              this.produtos = produtos
            })
        }).catch((erro) => {
          console.log(erro)
          this.carregamentoAtualizar = false
          this.mensagem = 'Erro na solicitação'
        })
    } else {
      this.estoqueService.atualizarEstoqueNaoRastreado(produtoAtualizar)
        .then(() => {
          this.carregamentoAtualizar = false
          this.mensagem = 'Produto atualizado com sucesso'
          this.estoqueService.getEstoque()
            .then((produtos: Produto[]) => {
              this.produtos = produtos
            })
        }).catch((erro) => {
          console.log(erro)
          this.carregamentoAtualizar = false
          this.mensagem = 'Erro na solicitação'
        })
    }
  }

  public filtrarPorBebida() {
    this.carregamentoPagina = true
    this.estoqueService.getEstoque()
      .then((produtos: Produto[]) => {
        this.produtos = produtos.filter((p) => {
          return p.tipo == 'bebida'
        })
        this.carregamentoPagina = false
      })
  }
  public filtrarPorComida() {
    this.carregamentoPagina = true
    this.estoqueService.getEstoque()
      .then((produtos: Produto[]) => {
        this.produtos = produtos.filter((p) => {
          return p.tipo == 'comida'
        })
        this.carregamentoPagina = false
      })
  }

  public buscarPorNomeProduto(nomeProduto: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNomeProduto.next(nomeProduto)
  }

  public inserirQuantidade() {
    this.mostrarQtd = true
  }
  ngOnDestroy() {
    this.subjectPesquisaNomeProduto.unsubscribe
  }

}
