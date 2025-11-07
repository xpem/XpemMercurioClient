import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/SignIn/signin';
import { authGuard } from './auth-guard';
import { Signup } from './pages/user/SignUp/signup';
import { UpdatePassword } from './pages/user/UpdatePassword/update-password';
import { PasswordSendEmail } from './pages/user/PasswordSendEmail/passwordsendemail';
import { VinculoList } from './pages/vinculo-list/vinculo-list';
import { MercadoLivreOauthCallback } from './pages/MercadoLivre/mercadoLivreOAuthCallback/mercado-livre-oauthcallback';
import { BondList } from './pages/Bond/bond-list/bond-list';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'user/signin', component: Signin },
  { path: 'user/signup', component: Signup },
  { path: 'user/update-password', component: UpdatePassword },
  { path: 'user/password-send-email', component: PasswordSendEmail },
  { path: 'MercadoLivre/OAuthCallback', component: MercadoLivreOauthCallback },
  { path: 'vinculos', component: VinculoList, canActivate: [authGuard] },
  { path: 'bond-list', component: BondList, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
