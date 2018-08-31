import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { Cliente } from "../../interfaces/cliente.interface";
import { ClientesService } from "../../services/clientes.service";
import { AuthenticationService } from "../../services/authentication.service";
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: []
})
export class ClienteComponent implements OnInit {

  private cliente:any;
  private politicas:any[];

  id:string;
  isDataAvailable:boolean = false;
  flagPoliticas:boolean = false;
  searchText:string = " ";
  isAdmin:boolean = false;


  constructor(private _clientesService: ClientesService,
              private _authenticationService: AuthenticationService,
              private router:Router,
              private route:ActivatedRoute) {

      this.route.params
        .subscribe(parametros=>{

          this.id = parametros['id']
          
          this._clientesService.getCliente( this.id )
            .subscribe(data => {
              this.cliente = data;
              this.isDataAvailable = true;
            })
          
          this.isAdmin = this._authenticationService.isAdmin();
        });
  }

  verPoliticas(){

    this._clientesService.getPoliticas(this.cliente.id)
      .subscribe(data => {
        this.politicas = data
        this.flagPoliticas = true;
      })
  }

  ngOnInit() {
  }

}
