import { Routes } from "@angular/router"
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { InserirOrderComponent } from './pedido/inserir-pedido/inserir-pedido.component'
import { ListarOrdersComponent } from './pedido/listar-pedidos/listar-pedidos.component'
import { AutenticacaoGuardService } from './services/autenticacao/autenticacao.guard.service'
import { ListarTodosOrdersComponent } from './pedido/listar-todos-pedidos/listar-todos-pedidos.component'
import { ListarEstoqueComponent } from './estoque/listar-estoque/listar-estoque.component'
import { InserirProdutoComponent } from './estoque/inserir-produto/inserir-produto.component'
import { ListarTodosClientsComponent } from './cliente/listar-todos-clientes/listar-todos-clientes.component'
import { InserirClientComponent } from './cliente/inserir-cliente/inserir-cliente.component'
import { RelatorioComponent } from './relatorio/relatorio.component'

export const ROUTES: Routes = [
        { path: '', component: LoginComponent },
        { path: 'home', component: HomeComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'inserirPedido', component: InserirOrderComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'home/inserirPedido', component: InserirOrderComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'listarPedidosAbertos', component: ListarOrdersComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'listarTodosPedidos', component: ListarTodosOrdersComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'listarEstoque', component: ListarEstoqueComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'inserirProduto', component: InserirProdutoComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'home/inserirProduto', component: InserirProdutoComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'listarTodosClientes', component: ListarTodosClientsComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'inserirCliente', component: InserirClientComponent, canActivate: [AutenticacaoGuardService] },
        { path: 'relatorio', component: RelatorioComponent, canActivate: [AutenticacaoGuardService] }
]