import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from "../../services/authentication.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {
  
  constructor(private _authenticationService:AuthenticationService) { }

  ngOnInit() {

  }
  
  isLoggedIn(){    
    return this._authenticationService.isLoggedIn();
  }

}
