import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() public eventoLogin: EventEmitter<string> = new EventEmitter<string>()
  public carregamentoPagina: boolean = false
  public erroLogin: string

  public formularioLogin: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.email, Validators.required]),
    'senha': new FormControl(null, [Validators.required]),
  })
  constructor(private autenticacaoLogin: AutenticacaoLogin) { }

  ngOnInit() { }


  public autenticar() {

    this.carregamentoPagina = true

    this.autenticacaoLogin.autenticarLoginEmailSenha(
      this.formularioLogin.value.email,
      this.formularioLogin.value.senha
    )
      .then((idToken: string) => {

        this.eventoLogin.emit('logado')
        this.carregamentoPagina = false
      })
      .catch((erro: any) => {
        console.log(erro)
        if (erro.code === 'auth/wrong-password') {
          this.erroLogin = 'Senha inválida para esse endereço de e-mail.'
        }
        if (erro.code === 'auth/user-not-found') {
          this.erroLogin = 'Esse endereço de e-mail não está cadastrado.'
        }

        if (erro.code === 'auth/network-request-failed') {
          this.erroLogin = 'Não foi possível autenticar. Erro de conexão.'
        }
        this.carregamentoPagina = false

      })
  }

  public loginGoogle() {
    this.autenticacaoLogin.autenticarComGoogle()
      .then(() => {
        this.eventoLogin.emit('logado')
      })
      .catch((erro) => {
        console.log(erro)
      })
  }

}
