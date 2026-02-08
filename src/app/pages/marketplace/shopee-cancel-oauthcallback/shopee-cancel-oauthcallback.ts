import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user-api';

@Component({
  selector: 'app-shopee-cancel-oauthcallback',
  imports: [RouterModule],
  templateUrl: './shopee-cancel-oauthcallback.html',
  styleUrl: './shopee-cancel-oauthcallback.css',
})
export class ShopeeCancelOauthcallback implements OnInit {
  errorMessage: WritableSignal<string> = signal('');
  submitted: WritableSignal<boolean> = signal(false);
  userApiService = inject(UserService);
  router = inject(Router);

  //apos desconexao com a shopee, inativa a credencial na api
  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const credId = urlParams.get('id');

    if (!credId) {
      this.errorMessage.set(
        'Credencial inválida. Não foi possível identificar a conta Shopee a ser desconectada.'
      );
      return;
    }

    this.userApiService
      .inactivateCredential(credId)
      .subscribe({
        next: (response) => {
          console.log('Credencial inativada com sucesso:', response);
          this.submitted.set(true);
        },
        error: (error) => {
          console.error('Erro ao inativar credencial:', error);
          this.errorMessage.set('Erro ao desconectar Shopee. Por favor, tente novamente.');
        }
      });
  }
}

