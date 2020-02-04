import { ItenPedido } from './itemPedido'
import { Cliente } from './cliente'

export class Pedido {
    public idPedido: string
    public dataPedido: string
    public status: string
    public dataFechamento: string
    public nomeCLiente: string
    public cliente: Cliente
    public itensPedido: ItenPedido[] = []
    public valorPedido: number
    public observacoes: string
    public mesPedido: string
    public tipoPagamento: string
}