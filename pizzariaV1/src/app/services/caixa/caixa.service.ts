import { Caixa } from '../../model/caixa'
import * as firebase from 'firebase'
import { Injectable } from '@angular/core'
import { Pedido } from 'src/app/model/pedido'

@Injectable()
export class CaixaService {
    private valorCaixa = 0

    constructor() { }

    public inserirValorCaixa(valorPedido: number, pedido: Pedido) {

        this.getValorCashier()
            .then((valorCaixa: any) => {
                this.valorCaixa = valorCaixa
            })
            .then(() => {
                let path = firebase.database().ref('caixa/')
                path.update({
                    valorCaixa: (this.valorCaixa + valorPedido)
                })

            })


    }

    public getValorCashier(): Promise<any> {
        let caixa: Caixa[] = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('caixa/')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach((childSnapshot: any) => {
                        caixa.push(childSnapshot.val())
                    })
                    resolve(caixa[1])
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }
    public getStatusCaixa(): Promise<any> {
        let caixa: Caixa[] = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('caixa/')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach((childSnapshot: any) => {
                        caixa.push(childSnapshot.val())
                    })
                    resolve(caixa[0])
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public fecharCaixa(): Promise<any> {
        let path = firebase.database().ref('caixa/')
        return new Promise((resolve, reject) => {
            path.update({
                status: 'fechado',
                valorCaixa: 0
            })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }
    public abrirCaixa(valorCaixa: number): Promise<any> {
        let path = firebase.database().ref('caixa/')
        return new Promise((resolve, reject) => {
            path.update({
                status: 'aberto',
                valorCaixa: valorCaixa
            })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }
}