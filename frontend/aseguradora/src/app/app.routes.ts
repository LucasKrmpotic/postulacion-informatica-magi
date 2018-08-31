import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ClientesComponent } from "./components/clientes/clientes.component";
import { ClienteComponent } from "./components/cliente/cliente.component";
import { PoliticasComponent } from "./components/politicas/politicas.component";
import { PoliticaComponent } from "./components/politica/politica.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
    { path: 'cliente/:id', component: ClienteComponent, canActivate: [AuthGuard] },
    { path: 'politicas', component: PoliticasComponent, canActivate: [AuthGuard] },
    { path: 'politica/:id', component: PoliticaComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', pathMatch:'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(routes);