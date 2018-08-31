import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_ROUTING } from "./app.routes";

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { PoliticaComponent } from './components/politica/politica.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';

// pipes
import { GrdFilterPipe } from './pipes/grdfilter.pipe';

// services
import { ClientesService } from "./services/clientes.service";
import { PoliticasService } from "./services/politicas.service";
import { AuthenticationService } from "./services/authentication.service";

// interceptors
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClientesComponent,
    GrdFilterPipe,
    ClienteComponent,
    PoliticasComponent,
    PoliticaComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    APP_ROUTING
  ],
  providers: [
    ClientesService,
    PoliticasService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
