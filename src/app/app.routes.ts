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
import { CompanyEdit } from './pages/company/company-edit/company-edit';
import { CompanyTaxInformationEdit } from './pages/company/company-tax-information-edit/company-tax-information-edit';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [authGuard], data: { title: '<i class="bi bi-house"></i> Principal' } },
  { path: 'user/signin', component: Signin, data: { title: 'Entrar' } },
  { path: 'user/signup', component: Signup, data: { title: 'Cadastrar' } },
  { path: 'user/signin-super-admin', component: SignInSuperAdmin, data: { title: 'Login Super Admin' } },
  { path: 'user/update-password', component: UpdatePassword, data: { title: 'Atualizar Senha' } },
  { path: 'user/password-send-email', component: PasswordSendEmail, data: { title: 'Recuperar Senha' } },
  { path: 'MercadoLivre/OAuthCallback', component: MercadoLivreOAuthCallback, data: { title: 'MercadoLivre OAuth' } },
  { path: 'Shopee/OAuthCallback', component: ShopeeOAuthCallback, data: { title: 'Shopee OAuth' } },
  { path: 'Shopee/OAuthCallback/Cancel', component: ShopeeCancelOauthcallback, data: { title: 'Shopee OAuth' } },
  { path: 'bond-list', component: BondList, canActivate: [authGuard], data: { title: '<i class="bi bi-shop-window"></i> Marketplaces' } },
  { path: 'order', component: OrderDetail, canActivate: [authGuard], data: { title: '<i class="bi bi-receipt"></i> Detalhes do Pedido' } },
  { path: 'product-list', component: ProductList, canActivate: [authGuard], data: { title: '<i class="bi bi-box2"></i> Produtos' } },
  { path: 'product/detail', component: ProductDetail, canActivate: [authGuard], data: { title: '<i class="bi bi-box2"></i> Detalhes do Produto' } },
  { path: 'shipment-pending-labels-list', component: ShipmentPendingLabelsList, canActivate: [authGuard], data: { title: '<i class="bi bi-truck"></i> Etiquetas Pendentes' } },
  { path: 'company/company-edit', component: CompanyEdit, canActivate: [authGuard], data: { title: '<i class="bi bi-building"></i> Editar Empresa' } },
  { path: 'company/tax-information-edit', component: CompanyTaxInformationEdit, canActivate: [authGuard], data: { title: '<i class="bi bi-file-earmark-ruled"></i> Editar Informações Fiscais' } },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
