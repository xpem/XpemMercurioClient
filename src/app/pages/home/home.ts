import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ToastService } from '../../services/toast.service';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';

@Component({
  selector: 'app-home',
  imports: [Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private toastService: ToastService, private mercadoLivreService: MercadoLivreService) { }

  salvarDados() {
    // Lógica para salvar os dados...

    // Exibe o toast
    this.toastService.showToast('Dados salvos com sucesso!', 'success');
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
