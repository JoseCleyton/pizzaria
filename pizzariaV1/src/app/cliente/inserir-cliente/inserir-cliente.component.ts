import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Cliente } from 'src/app/model/Cliente';

@Component({
  selector: 'app-inserir-cliente',
  templateUrl: './inserir-cliente.component.html',
  styleUrls: ['./inserir-cliente.component.scss']
})
export class InserirClientComponent implements OnInit {
  public formularioInserirCliente: FormGroup
  public cliente: Cliente
  public carregamentoPagina: boolean
  public mensagem: string
  constructor(private clienteService: ClienteService) { }

  ngOnInit() {

    this.formularioInserirCliente = new FormGroup({
      'nomeCliente': new FormControl(null, [Validators.required, Validators.min(3)]),
      'telefone': new FormControl(null, [Validators.required]),
      'rua': new FormControl(null, [Validators.required]),
      'bairro': new FormControl(null, [Validators.required]),
      'numero': new FormControl(null, [Validators.required, Validators.min(1)]),
    })
  }


  public inserirCliente() {
    this.cliente = {
      idCliente: (Math.floor(new Date().getMilliseconds()) + 1).toString(),
      nomeCliente: this.formularioInserirCliente.value.nomeCliente,
      telefone: this.formularioInserirCliente.value.telefone,
      rua: this.formularioInserirCliente.value.rua,
      bairro: this.formularioInserirCliente.value.bairro,
      numero: this.formularioInserirCliente.value.numero
    }
  }

  public cadastrarCliente() {
    this.carregamentoPagina = true
    this.clienteService.cadastrarClienteSemPedido(this.cliente)
      .then(() => {
        this.carregamentoPagina = false
        this.mensagem = 'Cliente cadastrado com sucesso'
        this.formularioInserirCliente.reset()
      })
      .catch((erro) => {
        this.carregamentoPagina = false
        console.log(erro)
        this.mensagem = 'Erro na solicitação'
      })
  }

  public limparMensagem() {
    this.mensagem = ''
  }

}
