import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/SignIn/signin';
import { authGuard } from './auth-guard';
import { Signup } from './pages/user/SignUp/signup';
import { UpdatePassword } from './pages/user/UpdatePassword/update-password';
import { PasswordSendEmail } from './pages/user/PasswordSendEmail/passwordsendemail';
import { MercadoLivreOauthCallback } from './pages/MercadoLivre/mercadoLivreOAuthCallback/mercado-livre-oauthcallback';
import { BondList } from './pages/Bond/bond-list/bond-list';
import { OrderDetail } from './pages/order-detail/order-detail';
import { ProductList } from './pages/Product/product-list/product-list';
import { ProductDetail } from './pages/Product/product-detail/product-detail';
import { ProductBondList } from './pages/Bond/product-bond-list/product-bond-list';
import { ShipmentPendingLabelsList } from './pages/Shipment/shipment-pending-labels-list/shipment-pending-labels-list';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'user/signin', component: Signin },
  { path: 'user/signup', component: Signup },
  { path: 'user/update-password', component: UpdatePassword },
  { path: 'user/password-send-email', component: PasswordSendEmail },
  { path: 'MercadoLivre/OAuthCallback', component: MercadoLivreOauthCallback },
  { path: 'bond-list', component: BondList, canActivate: [authGuard] },
  { path: 'order', component: OrderDetail, canActivate: [authGuard] },
  { path: 'product-list', component: ProductList, canActivate: [authGuard] },
  { path: 'product-detail', component: ProductDetail, canActivate: [authGuard] },
  { path: 'product-bond-list', component: ProductBondList, canActivate: [authGuard] },
  {path: 'shipment-pending-labels-list', component: ShipmentPendingLabelsList, canActivate: [authGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];
