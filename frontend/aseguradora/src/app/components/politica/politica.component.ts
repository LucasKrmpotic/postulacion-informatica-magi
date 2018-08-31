import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { PoliticasService } from "../../services/politicas.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-politica',
  templateUrl: './politica.component.html',
  styles: []
})
export class PoliticaComponent implements OnInit {

  private cliente:any;
  private politica:any;
  id:string;
  isDataAvailable:boolean = false;
  isAdmin:boolean = false;

  constructor(private _politicasService:PoliticasService,
              private _authenticationService:AuthenticationService,
              private router:Router,
              private route:ActivatedRoute) { 

      this.route.params
        .subscribe(parametros=>{

          this.id = parametros['id']
  
          this._politicasService.getPolitica( this.id )
            .subscribe(data => {
              this.politica = data;
              this.isAdmin = this._authenticationService.isAdmin();
              this.isDataAvailable = true;

              if (this.isAdmin){
                this._politicasService.getCliente( this.politica.clientId )
                  .subscribe(cliente => {
                    this.cliente = cliente;
                  })
              }

            })

        });
  }

  ngOnInit() {
  }

}
