import * as jsPDF from '../../assets/jsPDF-1.3.2'
import { Pedido } from '../model/pedido';
import { Cliente } from '../model/cliente';

export function emitirComanda(pedido: Pedido, cliente: Cliente, tipo: string) {
    let documento = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [73, 80]
    });
    documento.setFont("Arial");
    documento.setFontStyle("bold");
    documento.setFontSize(12);
    documento.text("Pizzaria", 30, 5);
    documento.setFontStyle("italic");
    documento.setFontSize(9);
    documento.text("Obrigado pela preferência, volte sempre", 10, 8);
    documento.text("(81) x.xxxx-xxxx", 25, 11);
    documento.text("CNJP : xxxxxx-xxxx", 3, 20);
    documento.text("-------------------------------------------------------------------------------", 0, 23);
    documento.text(new Date().getDate().toString() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 3, 27);
    documento.text('Número do Order: ' + pedido.idPedido, 35, 27);
    documento.text("-------------------------------------------------------------------------------", 0, 29);
    documento.setFontStyle('bold')
    documento.setFontSize(12);
    documento.text("CUPOM NÃO FISCAL", 19, 33);

    documento.setFontStyle("italic");
    documento.setFontSize(9);
    documento.text("QTD", 4, 39);
    documento.text("DESCRIÇÃO", 15, 39);
    if (tipo != 'Preparo') {
        documento.text("VALOR", 50, 39);
    }

    let count = 42
    pedido.itensPedido.forEach((p) => {

        documento.setFontStyle("italic");
        documento.setFontSize(8);
        documento.text(p.qtd, 5, count);
        documento.text(p.produto.nome, 16, count);
        if (tipo != 'Preparo') {
            documento.text(p.produto.valorUnitario + ',00', 51, count);
        }
        count += 4

    })

    if (tipo != 'Preparo') {
        documento.setFontStyle('bold')
        documento.setFontSize(10);
        documento.text("TOTAL", 8, count + 2);
        documento.text(pedido.valorPedido.toString() + ',00', 55, count + 2);

        documento.setFontStyle('italic')
        documento.setFontSize(9);
        documento.text('Nome do Cliente: ' + cliente.nomeCliente + ' - ' + cliente.telefone, 4, 70)
        documento.text('Endereço: ' + cliente.rua + ' nª ' + cliente.numero + ' , ' + cliente.bairro, 4, 75)
    } else {
        documento.text('Observações: ' + pedido.observacoes, 3, count + 10)
    }
    return documento

}