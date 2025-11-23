import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';
import { UserService } from '../../services/user-api';
import { UserProfile } from '../../models/user-profile.model';
import { OrderService } from '../../services/order-api';
import { Order } from '../../models/Order/order.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  goToOrderDetail(id: any) {
    //navegar para a pagina order passando o externalId como parametro
    window.location.href = `/order?id=${id}`;

  }

  constructor(
    private toastService: ToastService,
    private mercadoLivreService: MercadoLivreService,
    private orderService: OrderService,
    private userService: UserService
  ) { }
  userProfile: WritableSignal<UserProfile | null> = signal(null);
  orders: WritableSignal<Order[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(20);
  totalPages: WritableSignal<number> = signal(1);
  totalOrders: WritableSignal<number> = signal(0);

  pages = computed(() => {
    const tp = this.totalPages();
    const arr: number[] = [];
    for (let i = 1; i <= tp; i++) arr.push(i);
    return arr;
  });

  ngOnInit(): void {
    this.isLoading.set(true);
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

    this.orderService.getTotalOrders().subscribe({
      next: (response) => {
        console.log('Total orders:', response);
        const totalOrders = response.totalItems;
        const totalPages = response.totalPages;

        this.totalOrders.set(totalOrders);
        this.totalPages.set(totalPages);

        this.loadOrders(1);

        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadOrders(page);
  }

  loadOrders(page: number) {
    this.isLoading.set(true);
    this.orderService.get(page).subscribe({
      next: (response) => {
        console.log(`Orders for page ${page} fetched successfully:`, response);
        this.orders.set(response);
        this.currentPage.set(page);
        this.isLoading.set(false);
      }
    });
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
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
