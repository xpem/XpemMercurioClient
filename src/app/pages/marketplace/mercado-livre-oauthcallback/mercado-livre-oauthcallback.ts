import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MercadoLivreService } from '../../../services/mercadoLivre/mercado-livre-api';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mercado-livre-oauthcallback',
  imports: [RouterModule],
  templateUrl: './mercado-livre-oauthcallback.html',
  styleUrl: './mercado-livre-oauthcallback.css',
  standalone: true
})
export class MercadoLivreOAuthCallback implements OnInit {
  //será recebido via query params o code e o state do Mercado Livre
  //o state é o id publico do usuário
  errorMessage: WritableSignal<string> = signal('');
  submitted: WritableSignal<boolean> = signal(false);
  mercadoLivreService = inject(MercadoLivreService);
  router = inject(Router);
  
  ngOnInit(): void {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code === null || state === null) {
      console.error('Parâmetros de autenticação ausentes na URL.', { code, state });
      this.errorMessage.set(
        'Dados de autenticação inválidos ou ausentes. Tente novamente o processo de conexão.'
      );
      this.submitted.set(true);
      return;
    }

    console.log('Código recebido do Mercado Livre:', code);
    console.log('State recebido do Mercado Livre:', state);

    this.mercadoLivreService.postUserCredential({ Code: code, Token: state })
      .subscribe({
        next: (response) => {
          console.log('Credenciais enviadas com sucesso:', response);
          // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
          this.submitted.set(true);
        },
        error: (error) => {
          console.error('Erro ao enviar credenciais do mercado livre:', error);
          // Aqui você pode mostrar uma mensagem de erro para o usuário
          this.submitted.set(true);
          this.errorMessage.set(error.error?.message || 'Erro ao tentar associar conta.');
        }
      });
  }
}
