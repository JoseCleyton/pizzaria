import { CanActivate } from '@angular/router';
import { AutenticacaoLogin } from './autenticacaoLogin.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AutenticacaoGuardService implements CanActivate{
    constructor(private autenticacao : AutenticacaoLogin){}
    canActivate(): boolean {    
     return this.autenticacao.autenticado()
 }
}