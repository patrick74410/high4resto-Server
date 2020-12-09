import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environement/environement';
import { ConnexionI } from '../../interfaces/ConnexionI';

import { UserI } from 'src/app/interfaces/UserI';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {
  private currentConnexionISubject: BehaviorSubject<ConnexionI>;
  public currentConnexionI: Observable<ConnexionI>;
  public admin: boolean = false;
  public manager: boolean = false;
  public editor: boolean = false;
  public userName: string;

  constructor(private http: HttpClient) {
    this.currentConnexionISubject = new BehaviorSubject<ConnexionI>(JSON.parse(localStorage.getItem('currentConnexionI')));
    this.currentConnexionI = this.currentConnexionISubject.asObservable();
  }

  public get currentConnexionIValue(): ConnexionI {
    return this.currentConnexionISubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, { username, password })
      .pipe(map(connexion => {
        var oneday = new Date();
        oneday.setHours(oneday.getHours() + 9);
        localStorage.setItem("expire", oneday.toJSON());
        localStorage.setItem('currentConnexionI', JSON.stringify(connexion));
        this.currentConnexionISubject.next(connexion);
        this.http.get<UserI>(environment.apiUrl + '/users/me').pipe(take(1)).subscribe(user => {
          this.admin = user.roles.includes("ROLE_ADMIN");
          this.manager = user.roles.includes("ROLE_MANAGER");
          this.editor = user.roles.includes("ROLE_EDITOR");
          this.userName = user.username;
        })

        return connexion;
      }));
  }


  logout() {
    localStorage.removeItem('currentConnexionI');
    this.currentConnexionISubject.next(null);
  }
}