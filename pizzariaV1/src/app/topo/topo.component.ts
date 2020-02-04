import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.scss']
})
export class TopoComponent implements OnInit {
  public nomeUsuario: string
@Output() public eventoLogout : EventEmitter<string> = new EventEmitter<string>()
  constructor(private autenticacaoLogin : AutenticacaoLogin) { }

  ngOnInit() {
    this.nomeUsuario = localStorage.getItem('nomeUsuario')
  }

  public logout(){
    this.autenticacaoLogin.logout()
    this.eventoLogout.emit('logout')
  }
}
