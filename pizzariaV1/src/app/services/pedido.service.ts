import { Pedido } from '../model/pedido'
import { ItenPedido } from '../model/itemPedido'
import * as firebase from 'firebase'
import { of, Observable } from 'rxjs'
import { ClienteService } from './cliente/cliente.service'
import { Cliente } from '../model/cliente'
import { CaixaService } from './caixa/caixa.service'

export class PedidoService {
    private id: number = 1
    public pedido: Pedido = new Pedido()
    public pedidos: Pedido[] = null


    constructor(private clienteService: ClienteService, private caixaService: CaixaService) { }

    public addProductOrder(itemPedido: ItenPedido, valorPedido: number) {
        itemPedido.id = this.id
        this.id++
        this.pedido.itensPedido.push(itemPedido)
        this.pedido.valorPedido += valorPedido
    }

    public cadastrarPedidoECliente(observacoes: string, cliente: Cliente, tipoPagamento: string): Promise<any> {
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let hour = new Date().getUTCMilliseconds()
        let dataAtualizada = day + '/' + month + '/' + year

        this.pedido.cliente = cliente
        this.pedido.tipoPagamento = tipoPagamento
        this.pedido.status = 'aberto'
        this.pedido.idPedido = ((hour + cliente.idCliente.length) / 2).toString().replace('.', '')
        this.pedido.dataPedido = dataAtualizada
        this.pedido.observacoes = observacoes
        this.pedido.dataFechamento = ''

        return new Promise((resolve, reject) => {

            firebase.database().ref(`pedidos/${btoa(this.pedido.idPedido.toString())}`)
                .set({
                    idPedido: this.pedido.idPedido,
                    dataPedido: this.pedido.dataPedido,
                    status: this.pedido.status,
                    dataFechamento: this.pedido.dataFechamento,
                    idCliente: this.pedido.cliente.idCliente,
                    itensPedido: this.pedido.itensPedido,
                    valorPedido: this.pedido.valorPedido,
                    observacoes: this.pedido.observacoes,
                    tipoPagamento: this.pedido.tipoPagamento

                })
                .then((sucess) => {
                    resolve(sucess)
                    this.clienteService.cadastrarClient(cliente, this.pedido)
                    this.pedido.idPedido = undefined
                    this.pedido.dataPedido = ''
                    this.pedido.status = ''
                    this.pedido.cliente = null
                    this.pedido.itensPedido = []
                    this.pedido.valorPedido = 0
                    this.pedido.observacoes = ''
                    this.id = 1
                    this.pedidos = null
                })
                .catch((erro) => {
                    reject(erro)
                })
        })


    }

    public cadastrarPedido(observacoes: string, cliente: Cliente, tipoPagamento: string): Promise<any> {
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let hour = new Date().getUTCMilliseconds()
        let dataAtualizada = day + '/' + month + '/' + year

        this.pedido.cliente = cliente
        this.pedido.tipoPagamento = tipoPagamento
        this.pedido.status = 'aberto'
        this.pedido.idPedido = ((hour + cliente.idCliente.length) / 2).toString().replace('.', '')
        this.pedido.dataPedido = dataAtualizada
        this.pedido.observacoes = observacoes
        this.pedido.dataFechamento = ''

        return new Promise((resolve, reject) => {

            firebase.database().ref(`pedidos/${btoa(this.pedido.idPedido.toString())}`)
                .set({
                    idPedido: this.pedido.idPedido,
                    dataPedido: this.pedido.dataPedido,
                    status: this.pedido.status,
                    dataFechamento: this.pedido.dataFechamento,
                    idCliente: this.pedido.cliente.idCliente,
                    itensPedido: this.pedido.itensPedido,
                    valorPedido: this.pedido.valorPedido,
                    observacoes: this.pedido.observacoes,
                    tipoPagamento: this.pedido.tipoPagamento

                })
                .then((sucess) => {
                    resolve(sucess)
                    this.pedido.idPedido = undefined
                    this.pedido.dataPedido = ''
                    this.pedido.status = ''
                    this.pedido.cliente = null
                    this.pedido.itensPedido = []
                    this.pedido.valorPedido = 0
                    this.pedido.observacoes = ''
                    this.id = 1
                    this.pedidos = null
                })
                .catch((erro) => {
                    reject(erro)
                })
        })


    }

    public getOrderItems(): ItenPedido[] {
        return this.pedido.itensPedido
    }

    public getValorOrder(): number {
        if (this.pedido.valorPedido === undefined) {
            this.pedido.valorPedido = 0
        }
        return this.pedido.valorPedido
    }

    public deleteItem(itemExcluir: ItenPedido, valorPedido: number): ItenPedido[] {

        let index = this.pedido.itensPedido.findIndex((item: ItenPedido) => {
            return item.id === itemExcluir.id
        })
        let itemRetornado = this.pedido.itensPedido.find((i: ItenPedido) => {
            return i.id === itemExcluir.id
        })
        this.pedido.valorPedido = this.pedido.valorPedido - (itemRetornado.qtd * itemRetornado.produto.valorUnitario)
        console.log('Produto', itemRetornado)
        console.log('Valor pedido', this.pedido.valorPedido)
        this.pedido.itensPedido.splice(index, 1)

        return this.pedido.itensPedido
    }

    public getOrders(): Promise<any> {
        let pedidos: Pedido[] = []


        return new Promise((resolve, reject) => {

            if (this.pedidos == null || this.pedidos == undefined) {
                firebase.database().ref('pedidos/')
                    .once('value')
                    .then((snapshot: any) => {
                        snapshot.forEach(childSnapshot => {
                            let pedido: Pedido = childSnapshot.val()
                            pedidos.push(pedido)
                        })

                        this.clienteService.buscarTodosClientes()
                            .then((clientes: Cliente[]) => {
                                pedidos.filter((p: any) => {
                                    clientes.filter((c: Cliente) => {
                                        if (p.idCliente == c.idCliente) {
                                            p.cliente = c
                                        }
                                    })
                                })

                                resolve(pedidos)

                            })
                    })
                    .catch((erro) => {
                        reject(erro)
                    })
            } else {
                resolve(this.pedidos)
            }


        })
    }

    public getOpenOrders(): Promise<any> {
        let pedidos: Pedido[] = []
        return new Promise((resolve, reject) => {
            if (this.pedidos == null || this.pedidos == undefined) {
                firebase.database().ref('pedidos/')
                    .once('value')
                    .then((snapshot: any) => {
                        snapshot.forEach(childSnapshot => {
                            let pedido: Pedido = childSnapshot.val()
                            if (pedido.status == 'aberto') {
                                pedidos.push(pedido)
                            }

                        })
                        this.clienteService.buscarTodosClientes()
                            .then((clientes: Cliente[]) => {
                                pedidos.filter((p: any) => {
                                    clientes.filter((c: Cliente) => {
                                        if (p.idCliente == c.idCliente) {
                                            p.cliente = c
                                        }
                                    })
                                })

                                resolve(pedidos)
                            })
                    })
                    .catch((erro) => {
                        reject(erro)
                    })
            } else {

                let pedidosAux: Pedido[] = []
                this.pedidos.filter((p: Pedido) => {
                    if (p.status == 'aberto') {
                        pedidosAux.push(p)
                    }
                })
                resolve(pedidosAux)
            }


        })
    }

    public getCompletedOrders(): Promise<any> {
        let pedidos: Pedido[] = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('pedidos/')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach(childSnapshot => {
                        let pedido: Pedido = childSnapshot.val()
                        if (pedido.status === 'finalizado') {
                            pedidos.push(pedido)
                        }

                    })
                    this.clienteService.buscarTodosClientes()
                        .then((clientes: Cliente[]) => {
                            pedidos.filter((p: any) => {
                                clientes.filter((c: Cliente) => {
                                    if (p.idCliente == c.idCliente) {
                                        p.cliente = c
                                    }
                                })
                            })

                            resolve(pedidos)
                        })
                })
                .catch((erro) => {
                    reject(erro)
                })

        })
    }


    public updateStatusOrder(pedido: Pedido) {
        let path = firebase.database().ref(`pedidos/${btoa(pedido.idPedido.toString())}`)
        path.update({

            status: pedido.status,
            dataFechamento: pedido.dataFechamento
        })

    }

    public closeOrder(pedido: Pedido): Promise<any> {
        let path = firebase.database().ref(`pedidos/${btoa(pedido.idPedido.toString())}`)
        return new Promise((resolve, reject) => {
            path.update({
                status: pedido.status,
                dataFechamento: pedido.dataFechamento
            })
                .then((success) => {
                    this.caixaService.inserirValorCaixa(pedido.valorPedido, pedido)
                    resolve(success)
                })
                .catch((erro) => {
                    reject((erro))
                })
        })
    }

    public getOrdersValue(): Promise<any> {
        let valoresTotais = []
        return new Promise((resolve, reject) => {
            firebase.database().ref('pedidos/')
                .once('value')
                .then((snapshot: any) => {
                    snapshot.forEach(childSnapshot => {
                        let valores = childSnapshot.val()
                        valoresTotais.push(valores.valorPedido)
                    });
                    resolve(valoresTotais)
                })
                .catch((erro) => {
                    reject(erro)
                })
        })
    }

    public searchByNumberOrder(numeroPedido: string): Observable<Pedido[]> {
        let pedidos: Pedido[] = []
        this.getOpenOrders()
            .then((pedidosAbertos: Pedido[]) => {
                pedidosAbertos.filter((p: Pedido) => {
                    if (p.idPedido.toString().match(new RegExp(numeroPedido))) {
                        pedidos.push(p)
                    }
                })
            })

        return of<Pedido[]>(pedidos)

    }

    public searchByNameClient(nomeCliente: string): Observable<Pedido[]> {
        let pedidos: Pedido[] = []

        this.getOpenOrders()
            .then((pedidosAbertos: Pedido[]) => {
                pedidosAbertos.filter((p: Pedido) => {
                    if (p.cliente.nomeCliente.toLowerCase().match(new RegExp(nomeCliente.toLowerCase()))) {
                        pedidos.push(p)
                    }
                })
            })

        return of<Pedido[]>(pedidos)

    }

}