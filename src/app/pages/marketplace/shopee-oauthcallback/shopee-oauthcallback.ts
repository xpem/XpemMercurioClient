import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ShopeeApiService } from '../../../services/MercadoLivre/shopee-api';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-shopee-oauthcallback',
  imports: [RouterModule],
  templateUrl: './shopee-oauthcallback.html',
  styleUrl: './shopee-oauthcallback.css',
})
export class ShopeeOAuthCallback implements OnInit {

  errorMessage: WritableSignal<string> = signal('');
  submitted: WritableSignal<boolean> = signal(false);
  shopeeApiService = inject(ShopeeApiService);
  router = inject(Router);

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = urlParams.get('id');
    const shopId = urlParams.get('shop_id');

    console.log('Código recebido do Shopee:', code);
    console.log('ID público recebido do Shopee:', token);
    console.log('Shop ID recebido do Shopee:', shopId);

    this.shopeeApiService.postUserCredential({ Code: code!, Token: token!, ShopId: shopId! })
      .subscribe({
        next: (response) => {
          console.log('Credenciais enviadas com sucesso:', response);
          this.submitted.set(true);
        },
        error: (error: unknown) => {
          console.error('Erro ao enviar credenciais:', error);
          this.errorMessage.set('Erro ao conectar com Shopee. Por favor, tente novamente.');
        }
      });

  }
}
