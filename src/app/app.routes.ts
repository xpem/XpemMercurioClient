import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/SignIn/signin';
import { authGuard } from './auth-guard';
import { Signup } from './pages/user/SignUp/signup';
import { UpdatePassword } from './pages/user/UpdatePassword/update-password';
import { PasswordSendEmail } from './pages/user/PasswordSendEmail/passwordsendemail';
import { MercadoLivreOauthCallback } from './pages/MercadoLivre/mercadoLivreOAuthCallback/mercado-livre-oauthcallback';
import { BondList } from './pages/Bond/bond-list/bond-list';
import { Order } from './pages/order/order';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'user/signin', component: Signin },
  { path: 'user/signup', component: Signup },
  { path: 'user/update-password', component: UpdatePassword },
  { path: 'user/password-send-email', component: PasswordSendEmail },
  { path: 'MercadoLivre/OAuthCallback', component: MercadoLivreOauthCallback },
  { path: 'bond-list', component: BondList, canActivate: [authGuard] },
    { path: 'order', component: Order, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
