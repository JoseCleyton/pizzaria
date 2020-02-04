import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cliente } from 'src/app/model/cliente';
import { of, Subject, Observable } from 'rxjs';
import { catchError, switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-todos-clientes',
  templateUrl: './listar-todos-clientes.component.html',
  styleUrls: ['./listar-todos-clientes.component.scss']
})
export class ListarTodosClientsComponent implements OnInit {
  public clientes: Cliente[]
  public carregamentoPagina: boolean
  public carregamentoAtualizar: boolean
  public formularioAtualizarCliente: FormGroup
  public clienteVisualizar: Cliente
  public mensagem: string
  public mensagemCarregamento: string
  public subjectPesquisaNomeCliente: Subject<string> = new Subject
  public pedidosPesquisaNomeCliente: Observable<Cliente[]>

  constructor(private clientService: ClienteService) { }

  ngOnInit() {
    this.mensagem = ''
    this.carregamentoPagina = true

    this.pedidosPesquisaNomeCliente = this.subjectPesquisaNomeCliente.pipe(
      debounceTime(1000),
      switchMap((nome: string) => {
        if (nome.trim() === '') {
          this.clientService.buscarTodosClientes()
            .then((clientes: Cliente[]) => {
              this.clientes = clientes
            })
          this.carregamentoPagina = false
          return of<Cliente[]>(this.clientes)
        }
        let clientesAux = []
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
        this.clientService.buscarTodosClientes()
          .then((clientes: Cliente[]) => {
            this.clientes = clientes
          })
        this.carregamentoPagina = false
        return of<Cliente[]>(this.clientes)
      })
    )

    this.pedidosPesquisaNomeCliente.subscribe(
      (clientes: Cliente[]) => { this.clientes = clientes }
    )

    this.clientService.buscarTodosClientes()
      .then((Clients: Cliente[]) => {
        if (Clients.length <= 0) {
          this.mensagemCarregamento = 'Não há Clients cadastrados'
          this.carregamentoPagina = false
        } else {
          this.clientes = Clients
          this.carregamentoPagina = false
        }
      })
      .catch((erro) => {
        console.log(erro)
        this.mensagemCarregamento = 'Erro na solicitação'
        this.carregamentoPagina = false
      })
    this.formularioAtualizarCliente = new FormGroup({
      'nomeCliente': new FormControl(null, [Validators.required, Validators.min(3)]),
      'telefone': new FormControl(null, [Validators.required]),
      'rua': new FormControl(null, [Validators.required]),
      'bairro': new FormControl(null, [Validators.required]),
      'numero': new FormControl(null, [Validators.required, Validators.min(1)]),
    })
  }

  public editarCliente(idCliente: string) {
    this.clienteVisualizar = this.clientes.find((cliente: Cliente) => {
      return cliente.idCliente == idCliente
    })
    this.formularioAtualizarCliente.get('nomeCliente').setValue(this.clienteVisualizar.nomeCliente)
    this.formularioAtualizarCliente.get('telefone').setValue(this.clienteVisualizar.telefone)
    this.formularioAtualizarCliente.get('rua').setValue(this.clienteVisualizar.rua)
    this.formularioAtualizarCliente.get('bairro').setValue(this.clienteVisualizar.bairro)
    this.formularioAtualizarCliente.get('numero').setValue(this.clienteVisualizar.numero)
  }

  public atualizarCliente() {
    this.carregamentoAtualizar = true

    let clienteEditar: Cliente = this.clienteVisualizar

    clienteEditar.nomeCliente = this.formularioAtualizarCliente.value.nomeCliente
    clienteEditar.telefone = this.formularioAtualizarCliente.value.telefone
    clienteEditar.rua = this.formularioAtualizarCliente.value.rua
    clienteEditar.bairro = this.formularioAtualizarCliente.value.bairro
    clienteEditar.numero = this.formularioAtualizarCliente.value.numero


    this.clientService.atualilzarCliente(clienteEditar)
      .then(() => {
        this.carregamentoAtualizar = false
        this.mensagem = 'Client atualizado com sucesso'
        this.formularioAtualizarCliente.reset()

        this.clientService.buscarTodosClientes()
          .then((clientes: Cliente[]) => {
            this.clientes = clientes
          })
          .catch((erro) => {
            console.log(erro)
          })
      })
      .catch((erro) => {
        console.log(erro)
        this.carregamentoAtualizar = false
        this.mensagem = 'Erro na solicitação'
      })
  }

  public limparMensagem() {
    this.mensagem = ''
  }

  public buscarPorNomeCliente(nomeClient: string) {
    this.carregamentoPagina = true
    this.subjectPesquisaNomeCliente.next(nomeClient)
  }
  ngOnDestroy() {
    this.subjectPesquisaNomeCliente.unsubscribe
  }
}
