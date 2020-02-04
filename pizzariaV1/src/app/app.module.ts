import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { InserirProdutoComponent } from './estoque/inserir-produto/inserir-produto.component'
import { MatInputModule } from '@angular/material/input';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { LoginComponent } from './login/login.component';
import { TopoComponent } from './topo/topo.component';
import { RodapeComponent } from './rodape/rodape.component';
import { HomeComponent } from './home/home.component';
import { InserirOrderComponent } from './pedido/inserir-pedido/inserir-pedido.component';
import { ListarOrdersComponent } from './pedido/listar-pedidos/listar-pedidos.component';
import { ListarTodosOrdersComponent } from './pedido/listar-todos-pedidos/listar-todos-pedidos.component';
import { ListarEstoqueComponent } from './estoque/listar-estoque/listar-estoque.component';
import { ListarTodosClientsComponent } from './cliente/listar-todos-clientes/listar-todos-clientes.component';
import { InserirClientComponent } from './cliente/inserir-cliente/inserir-cliente.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { AutenticacaoLogin } from './services/autenticacao/autenticacaoLogin.service';
import { PedidoService } from './services/pedido.service';
import { AutenticacaoGuardService } from './services/autenticacao/autenticacao.guard.service';
import { CaixaService } from './services/caixa/caixa.service';
import { EstoqueService } from './services/estoque/estoque.service';
import { ClienteService } from './services/cliente/cliente.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopoComponent,
    RodapeComponent,
    HomeComponent,
    InserirOrderComponent,
    ListarOrdersComponent,
    ListarTodosOrdersComponent,
    ListarEstoqueComponent,
    InserirProdutoComponent,
    ListarTodosClientsComponent,
    InserirClientComponent,
    RelatorioComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    ChartsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule

  ],
  providers: [
    AutenticacaoLogin,
    PedidoService,
    AutenticacaoGuardService,
    CaixaService,
    EstoqueService,
    ClienteService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
