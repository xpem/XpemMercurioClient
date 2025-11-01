import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';

@Component({
  selector: 'app-mercado-livre-oauthcallback',
  imports: [],
  templateUrl: './mercado-livre-oauthcallback.html',
  styleUrl: './mercado-livre-oauthcallback.css',
  standalone: true
})
export class MercadoLivreOauthCallback implements OnInit {
  //será recebido via query params o code e o state do Mercado Livre
  //o state é o id publico do usuário
  errorMessage: WritableSignal<string> = signal('');
  submitted: WritableSignal<boolean> = signal(false);
  constructor(private MercadoLivreService: MercadoLivreService) { }

  ngOnInit(): void {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('Código recebido do Mercado Livre:', code);
    console.log('State recebido do Mercado Livre:', state);

    this.MercadoLivreService.postUserCredential({ Code: code!, UserPublicId: state! })
      .subscribe({
        next: (response) => {
          console.log('Credenciais enviadas com sucesso:', response);
          // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
          this.submitted.set(true);
        },
        error: (error) => {
          console.error('Erro ao enviar credenciais:', error);
          // Aqui você pode mostrar uma mensagem de erro para o usuário
          this.errorMessage.set(error.error.message || 'Erro ao tentar associar conta.');
        }
      });
  }
}
