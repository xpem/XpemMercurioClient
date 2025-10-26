import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/signin/signin';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'signin', component: Signin },
  {path: '', redirectTo: 'home', pathMatch: 'full' }
];
