import * as firebase from 'firebase'
import { Pedido } from 'src/app/model/pedido'
import { Cliente } from 'src/app/model/cliente'
export class ClienteService {
    public clientes: Cliente[] = null

    public cadastrarClient(cliente: Cliente, pedido: Pedido) {

        firebase.database().ref(`clientes/${btoa(cliente.idCliente)}`)
            .set({
                idCliente: cliente.idCliente,
                nomeCliente: cliente.nomeCliente,
                rua: cliente.rua,
                bairro: cliente.bairro,
                numero: cliente.numero,
                telefone: cliente.telefone
            })
    }
    public cadastrarClienteSemPedido(cliente: Cliente): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`clientes/${btoa(cliente.idCliente)}`)
                .set({
                    idCliente: cliente.idCliente,
                    nomeCliente: cliente.nomeCliente,
                    rua: cliente.rua,
                    bairro: cliente.bairro,
                    numero: cliente.numero,
                    telefone: cliente.telefone,
                })
                .then((success) => {
                    resolve(success)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public buscarTodosClientes(): Promise<Cliente[]> {
        let clientes: Cliente[] = []
        return new Promise((resolve, reject) => {
           // if (this.clientes == null || this.clientes == undefined) {
                firebase.database().ref('clientes/')
                    .once('value')
                    .then((snapshot: any) => {
                        snapshot.forEach((childSnapshot) => {
                            let clientesAux = childSnapshot.val()
                            clientes.push(clientesAux)
                        })
                        this.clientes = clientes
                        resolve(clientes)
                    })
                    .catch((erro) => {
                        reject(erro)
                    })
            /*} else {
                resolve(this.clientes)
            }*/

        })
    }

    public atualilzarCliente(cliente: any): Promise<Cliente[]> {

        return new Promise((resolve, reject) => {
            let path = firebase.database().ref(`clientes/${btoa(cliente.idCliente)}`)
            path.update({
                nomeCliente: cliente.nomeCliente,
                rua: cliente.rua,
                bairro: cliente.bairro,
                numero: cliente.numero,
                telefone: cliente.telefone,
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