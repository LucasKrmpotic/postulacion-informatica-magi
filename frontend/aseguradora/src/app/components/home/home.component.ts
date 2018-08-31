import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  user:any;
  constructor() { }

  ngOnInit() {
  
    this.user = JSON.parse(localStorage.getItem('currentUser'));

  }



}
