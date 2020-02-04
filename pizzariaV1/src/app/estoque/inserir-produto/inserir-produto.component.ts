import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';

@Component({
  selector: 'app-inserir-produto',
  templateUrl: './inserir-produto.component.html',
  styleUrls: ['./inserir-produto.component.scss']
})
export class InserirProdutoComponent implements OnInit {
  public formularioInserirProduto: FormGroup
  public produto: any
  public mensagem: string
  public carregamentoPagina: boolean
  public mostrarQtd: boolean

  constructor(private estoqueService: EstoqueService) { }

  ngOnInit() {
    this.mostrarQtd = false

    this.formularioInserirProduto = new FormGroup({
      'nomeProduto': new FormControl(null, [Validators.required, Validators.min(2)]),
      'valorUnitario': new FormControl(null, [Validators.required, Validators.min(1)]),
      'quantidade': new FormControl(),
      'tipo': new FormControl(null, [Validators.required])
    })
  }

  public inserirProduto() {
    this.produto = {
      nome: this.formularioInserirProduto.value.nomeProduto,
      valorUnitario: this.formularioInserirProduto.value.valorUnitario,
      tipo: this.formularioInserirProduto.value.tipo
    }
    console.log(this.produto)

  }
  public inserirProdutoEstoque() {
    if (this.mostrarQtd) {
      this.carregamentoPagina = true
      this.estoqueService.inserirNoEstoqueRastreado(this.produto, this.formularioInserirProduto.value.quantidade)
        .then(() => {
          this.mensagem = "Produto inserido no estoque com sucesso"
          this.carregamentoPagina = false
          this.formularioInserirProduto.reset()
        })
    } else {
      this.carregamentoPagina = true
      this.estoqueService.inserirNoEstoque(this.produto)
        .then(() => {
          this.mensagem = "Produto inserido no estoque com sucesso"
          this.carregamentoPagina = false
          this.formularioInserirProduto.reset()
        })
    }

  }
  public inserirQuantidade() {
    this.mostrarQtd = true
  }
  public limparMensagem() {
    this.mensagem = ''
  }

}


