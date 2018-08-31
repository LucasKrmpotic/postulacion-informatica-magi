import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PoliticasService {

  urlPoliticas = "http://localhost:3000/politicas";
  urlPolitica = "http://localhost:3000/politica/";
  urlCliente = "http://localhost:3000/politica/cliente/";

  constructor( private _http:HttpClient ) { }

  getPoliticas() {
    let url = this.urlPoliticas;
    return this._http.get( url )
      .pipe(
        map(data => <any> data), 
        catchError( (error:Response ) => {
          return throwError( 'Error recuperando politicas' )
        })
      )
  }

  getPolitica( id:string){
    let url = this.urlPolitica+id;
    return this._http.get( url )
  }

  getCliente( id:string){
    let url = this.urlCliente+id;
    return this._http.get( url )
  }

}
