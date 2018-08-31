import { Component, OnInit } from '@angular/core';
import { ClientesService } from "../../services/clientes.service";
import { Cliente } from '../../interfaces/cliente.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: []
})
export class ClientesComponent implements OnInit {
  
  filtro:string;
  clientes: any[] = [];

  constructor( private _clientesService: ClientesService) {

    this._clientesService.getClientes()
      .subscribe( data => {
        
        this.clientes = data;
        
      }) 
  }
  
  ngOnInit() {
  }
  
}
