import { Injectable } from '@angular/core';
import { Produto } from 'src/app/model/produto';
import * as firebase from 'firebase'


Injectable()
export class EstoqueService {
    public produtos: Produto[] = null

    public inserirNoEstoque(produto: Produto): Promise<any> {
        let idProduto = Math.floor(new Date().getMilliseconds())
        console.log(produto)
        produto.id = idProduto
        return new Promise((resolve, reject) => {
            firebase.database().ref(`estoque/naoRastreado/${btoa(produto.id.toString())}`)
                .set({
                    id: produto.id,
                    nome: produto.nome,
                    valorUnitario: produto.valorUnitario,
                    tipo: produto.tipo
                })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public inserirNoEstoqueRastreado(produto: Produto, quantidade: string): Promise<any> {
        let idProduto = Math.floor(new Date().getMilliseconds())
        produto.id = idProduto
        return new Promise((resolve, reject) => {
            firebase.database().ref(`estoque/rastreado/${btoa(produto.id.toString())}`)
                .set({
                    id: produto.id,
                    nome: produto.nome,
                    valorUnitario: produto.valorUnitario,
                    quantidade: quantidade,
                    tipo: produto.tipo
                })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }



    public atualizarEstoqueRastreado(produto: Produto): Promise<any> {
        let path = firebase.database().ref(`estoque/rastreado/${btoa(produto.id.toString())}`)
        return new Promise((resolve, reject) => {
            path.update({
                nome: produto.nome,
                valorUnitario: produto.valorUnitario,
                quantidade: produto.quantidade
            })
                .then((success) => {
                    this.getEstoque()
                        .then((produtos: Produto[]) => {
                            this.produtos = produtos
                            resolve(success)
                        })
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public atualizarEstoqueNaoRastreado(produto: Produto): Promise<any> {
        let path = firebase.database().ref(`estoque/rastreado/${btoa(produto.id.toString())}`)
        return new Promise((resolve, reject) => {
            path.update({
                nome: produto.nome,
                valorUnitario: produto.valorUnitario
            })
                .then((success) => {
                    this.getEstoque()
                        .then((produtos: Produto[]) => {
                            this.produtos = produtos
                            resolve(success)
                        })
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }
    public getEstoque(): Promise<any> {
        let produtos = []
        return new Promise((resolve, reject) => {
            if (this.produtos == null || this.produtos == undefined) {
                firebase.database().ref('estoque/rastreado')
                    .once('value')
                    .then((snapshot: any) => {
                        snapshot.forEach(childSnapshot => {
                            let produto = childSnapshot.val()
                            produtos.push(produto)
                        });
                    })
                    .then(() => {
                        firebase.database().ref('estoque/naoRastreado')
                            .once('value')
                            .then((snapshot: any) => {
                                snapshot.forEach(childSnapshot => {
                                    let produto = childSnapshot.val()
                                    produtos.push(produto)
                                });
                                this.produtos = produtos
                                resolve(produtos)
                            })
                    })
                    .catch((erro) => {
                        reject(erro)
                    })
            } else {
                resolve(this.produtos)
            }
        })
    }

    public getEstoqueAtivo(): Promise<any> {
        let produtos = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('estoque/rastreado')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach(childSnapshot => {
                        let produto = childSnapshot.val()
                        if (produto.quantidade >= 1) {
                            produtos.push(produto)
                        }
                    });
                })
                .then(() => {
                    firebase.database().ref('estoque/naoRastreado')
                        .once('value')
                        .then((snapshot: any) => {
                            snapshot.forEach(childSnapshot => {
                                let produto = childSnapshot.val()
                                produtos.push(produto)
                            });

                            resolve(produtos)
                        })
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }
    public getEstoqueRastreado(): Promise<any> {
        let produtos = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('estoque/rastreado')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach(childSnapshot => {
                        let produto = childSnapshot.val()
                        produtos.push(produto)
                    });

                    resolve(produtos)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }


    public atualizarEstoque(produto: Produto): Promise<any> {
        return new Promise((resolve, reject) => {
            let path = firebase.database().ref(`estoque/${btoa(produto.id.toString())}`)

            path.update({
                nome: produto.nome,
                quantidade: produto.quantidade,
                valorUnitario: produto.valorUnitario
            })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public getProduto(produto: Produto): Promise<any> {
        let pro: Produto[] = []
        return new Promise((resolve, reject) => {
            firebase.database().ref(`estoque/`)
                .once('value')
                .then((snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        let p: Produto = childSnapshot.val()
                        pro.push(p)
                    })
                    pro.forEach((p) => {
                        if (p.id === produto.id) {
                            let produtoRetornado = new Produto(
                                p.nome, p.valorUnitario
                            )
                            produtoRetornado.id = p.id
                            produtoRetornado.quantidade = p.quantidade
                            resolve(produtoRetornado)
                        }
                    })
                })
                .catch((erro) => {
                    reject(erro)
                })


        })


    }
}