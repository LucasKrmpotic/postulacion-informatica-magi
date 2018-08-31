import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Cliente } from "../interfaces/cliente.interface";

@Injectable()
export class ClientesService {
  
  urlClientes = "http://localhost:3000/clientes"; 
  urlCliente = "http://localhost:3000/cliente/";

  constructor( private _http:HttpClient ) {  }

  getClientes() {
    let url = this.urlClientes;
    return this._http.get( url )
      .pipe(
        map(data => <any> data), 
        catchError( (error:Response ) => {
          return throwError( 'Error recuperando clientes' )
        })
      )
  }

  getPoliticas( id:string ){

    let url = `${this.urlCliente}politicas/${id}`;
    return this._http.get( url )
      .pipe(
        map(data => <any> data), 
        catchError( (error:Response ) => {
          return throwError( 'Error recuperando politicas' )
        })
      )
  }

  getCliente ( id:string ){
    let url = this.urlCliente+id;
    return this._http.get( url )
  }
}
