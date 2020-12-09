import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthentificationService } from './authentification.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthentificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.currentConnexionIValue;
        if (currentUser && currentUser.access_token) {
            request = request.clone({ headers: request.headers.set("Authorization", "Bearer " + currentUser.access_token) });
        }

        return next.handle(request);
    }
}