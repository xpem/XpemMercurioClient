import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';
import { UserService } from '../../services/user-api';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private toastService: ToastService,
    private mercadoLivreService: MercadoLivreService,
    private userService: UserService
  ) { }

  userProfile!: UserProfile | null;

  salvarDados() {
    // Lógica para salvar os dados...

    // Exibe o toast
    this.toastService.showToast('Dados salvos com sucesso!', 'success');
  }

  ngOnInit(): void {
    console.log('Home component initialized');

    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('User profile:', response);
        console.log('User mercadoLivreCredentialid:', response.mercadoLivreCredentialid);

        if (!this.userProfile) {
          this.userProfile = {} as UserProfile;
        }
        
        if (response.mercadoLivreCredentialid) {
          this.userProfile.mercadoLivreCredentialid = response.mercadoLivreCredentialid;
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  conectarMercadoLivre() {
    this.mercadoLivreService.getAuthUri().subscribe({
      next: (response) => {
        console.log('url de autenticação do Mercado Livre:', response);
        // a response é uma URL de redirecionamento
        window.location.href = response;
      },
      error: (error) => {
        console.error('Erro ao conectar com o Mercado Livre:', error);
      }
    });
  }
}
