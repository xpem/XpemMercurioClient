import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';
import { UserService } from '../../services/user-api';
import { UserProfile } from '../../models/user-profile.model';
import { OrderService } from '../../services/MercadoLivre/order-api';
import { Order } from '../../models/Order/order.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private toastService: ToastService,
    private mercadoLivreService: MercadoLivreService,
    private orderService: OrderService,
    private userService: UserService
  ) { }
  userProfile: WritableSignal<UserProfile | null> = signal(null);
  orders: WritableSignal<Order[]> = signal([]);

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

        var _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialid) {
          _userProfile.mercadoLivreCredentialId = response.mercadoLivreCredentialid;
        }

        this.userProfile.set(_userProfile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });

    this.orderService.get(1).subscribe({
      next: (response) => {
        console.log('Orders fetched successfully:', response);
        this.orders.set(response);
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
