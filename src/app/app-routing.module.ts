import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ServerComponent } from './server/server.component';
import { AuthGuardService } from './services/Auth/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'', component:ServerComponent, canActivate: [AuthGuardService]},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
