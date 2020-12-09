import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpireService {
  check(): void {
    var expire = Date.parse(localStorage.getItem('expire'));
    if (!expire) {
      localStorage.removeItem('expire');
      localStorage.removeItem('currentConnexionI');
      location.reload();
    }
    if (expire < new Date().getTime()) {
      localStorage.removeItem('expire');
      localStorage.removeItem('currentConnexionI');
      location.reload();
    }
  }
  constructor() { }
}
