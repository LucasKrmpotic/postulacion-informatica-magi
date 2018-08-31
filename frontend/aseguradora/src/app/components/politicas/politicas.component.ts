import { Component, OnInit } from '@angular/core';
import { PoliticasService } from "../../services/politicas.service";
@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: []
})
export class PoliticasComponent implements OnInit {

  politicas: any[] = [];
  filtroId:string; 
  
  constructor( private _politicasService: PoliticasService) {
    this._politicasService.getPoliticas()
    .subscribe( data => {
      
      this.politicas = data;
      
    }) 
   }

  ngOnInit() {
  }

}
