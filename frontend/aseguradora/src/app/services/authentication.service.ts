import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  url = "http://localhost:3000/authenticate";

  constructor(private http: HttpClient) { }

    login(username: string, email: string) {
        return this.http.post<any>(this.url, { username, email })
            .pipe(map(user => {
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        if (localStorage.getItem('currentUser')) {
            return true;
        }
        return false;   
    }

    isAdmin(){
        return (JSON.parse(localStorage.getItem('currentUser')).role === "admin");
    }

}
