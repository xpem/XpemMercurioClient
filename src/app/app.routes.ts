import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/signin/signin';
import { authGuard } from './auth-guard';
import { Signup } from './pages/user/signup/signup';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'user/signin', component: Signin },
  { path: 'user/signup', component: Signup },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
