import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/user/sign-in/signin';
import { authGuard } from './auth-guard';
import { Signup } from './pages/user/sign-up/signup';
import { UpdatePassword } from './pages/user/update-password/update-password';
import { PasswordSendEmail } from './pages/user/password-send-email/passwordsendemail';
import { BondList } from './pages/bond/bond-list/bond-list';
import { OrderDetail } from './pages/order-detail/order-detail';
import { ProductList } from './pages/product/product-list/product-list';
import { ProductDetail } from './pages/product/product-detail/product-detail';
import { ShipmentPendingLabelsList } from './pages/shipment/shipment-pending-labels-list/shipment-pending-labels-list';
import { MercadoLivreOAuthCallback } from './pages/marketplace/mercado-livre-oauthcallback/mercado-livre-oauthcallback';
import { ShopeeOAuthCallback } from './pages/marketplace/shopee-oauthcallback/shopee-oauthcallback';
import { ShopeeCancelOauthcallback } from './pages/marketplace/shopee-cancel-oauthcallback/shopee-cancel-oauthcallback';
import { SignInSuperAdmin } from './pages/user/sign-in-super-admin/sign-in-super-admin';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'user/signin', component: Signin },
  { path: 'user/signup', component: Signup },
  { path: 'user/signin-super-admin', component: SignInSuperAdmin },
  { path: 'user/update-password', component: UpdatePassword },
  { path: 'user/password-send-email', component: PasswordSendEmail },
  { path: 'MercadoLivre/OAuthCallback', component: MercadoLivreOAuthCallback },
  { path: 'Shopee/OAuthCallback', component: ShopeeOAuthCallback },
  { path: 'Shopee/OAuthCallback/Cancel', component: ShopeeCancelOauthcallback },
  { path: 'bond-list', component: BondList, canActivate: [authGuard] },
  { path: 'order', component: OrderDetail, canActivate: [authGuard] },
  { path: 'product-list', component: ProductList, canActivate: [authGuard] },
  { path: 'Product/Detail', component: ProductDetail, canActivate: [authGuard] },
  { path: 'shipment-pending-labels-list', component: ShipmentPendingLabelsList, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
