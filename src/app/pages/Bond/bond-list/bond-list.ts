import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user-api';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';
import { Order } from '../../../models/Order/order.model';
import { Product } from '../../../models/Product/product.model';
import { ToastService } from '../../../services/toast.service';

declare const bootstrap: any;

@Component({
  selector: 'app-bond-list',
  imports: [],
  templateUrl: './bond-list.html',
  styleUrl: './bond-list.css',
})
export class BondList implements OnInit {
  userProfile: WritableSignal<UserProfile | null> = signal(null);
  SingleOrder: WritableSignal<Order | null> = signal(null);
  SingleProduct: WritableSignal<Product | null> = signal(null);
  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(true);
  todayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private userService: UserService, private mercadoLivreService: MercadoLivreService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getUserProfile()
  }

  getUserProfile() {
    this.isLoading.set(true);
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('User profile:', response);

        var _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialId) {
          _userProfile.mercadoLivreCredentialId = response.mercadoLivreCredentialId;
        }

        this.userProfile.set(_userProfile);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  ImportSingleOrder() {
    const orderIdInput = document.getElementById('orderId') as HTMLInputElement;
    const orderId = orderIdInput.value.trim();
    this.errorMessage.set('');
    if (orderId) {

      console.log('Importing order with ID:', orderId);
      this.mercadoLivreService.importSingleOrder(orderId).subscribe({
        next: (response) => {

          const order: Order = response;
          this.SingleOrder.set(order);

          //external id of SingleOrder
          const externalId = order.externalId;
          console.log('External ID of imported order:', externalId);
          this.showModal('ConfirmImportSingleOrderModal');
          this.hideModal('ImportSingleOrderModal');
        },
        error: (error) => {
          console.error('Error importing single order:', error);
          this.showModal('ErrorImportSingleModal');
          this.hideModal('ImportSingleOrderModal');

          this.errorMessage.set(error?.message || 'An error occurred while importing the order.');
        }
      });
    }
  }

  ImportOrdersByPeriod() {
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    this.errorMessage.set('');
    if (startDate && endDate) {

      if (startDate > endDate) {
        this.errorMessage.set('A data de início não pode ser maior que a data de fim.');
        return;
      }

      console.log('Importing orders from', startDate, 'to', endDate);
      this.mercadoLivreService.importOrdersByPeriod(startDate, endDate).subscribe({
        next: (response) => {
          console.log('Orders imported successfully:', response);
          this.toastService.showInfo('Importação de pedidos em processamento!', 5000);
          this.hideModal('ImportOrdersByPeriodModal');
          this.getUserProfile()
        },
        error: (error) => {
          console.error('Error importing orders by period:', error);
          this.showModal('ErrorImportSingleModal');
          this.hideModal('ImportOrdersByPeriodModal');
          this.errorMessage.set(error?.message || 'An error occurred while importing orders by period.');
        }
      });
    }
  }

  ImportSingleProduct() {
    const productIdInput = document.getElementById('productId') as HTMLInputElement;
    const productId = productIdInput.value.trim();
    this.errorMessage.set('');
    if (productId) {

      console.log('Importing product with ID:', productId);
      this.mercadoLivreService.importSingleProduct(productId).subscribe({
        next: (response) => {

          const product: Product = response;
          this.SingleProduct.set(product);

          //external id of SingleOrder
          const externalId = product.publicId;
          console.log('External ID of imported order:', externalId);

          this.showModal('ConfirmImportSingleProductModal');
          this.hideModal('ImportSingleProductModal');
        },
        error: (error) => {
          console.log('Error object:', error.error.message);
          this.showModal('ErrorImportSingleModal');
          this.hideModal('ImportSingleProductModal');

          this.errorMessage.set(error?.error?.message || 'An error occurred while importing the product.');
        }
      });
    }
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

  InactivateCredential(credentialId: string | undefined) {

    if (!credentialId) {
      console.error('Credential ID is undefined');
      this.toastService.showError('ID da credencial indefinido!', 5000);
      return;
    }

    this.mercadoLivreService.InactivateCredential(credentialId).subscribe({
      next: (response) => {
        console.log('Credential inactivated successfully:', response);
        this.toastService.showSuccess('Credencial desativada com sucesso!', 5000);
        //dismiss modal
        this.hideModal('unbondModal');
        //reload page after 2 seconds
      },
      error: (error) => {
        console.error('Error inactivating credential:', error);
        this.toastService.showError('Erro ao desativar credencial!', 5000);
      }
    });
  }

  goToOrderDetail(id: any) {
    //navegar para a pagina order passando o externalId como parametro
    window.location.href = `/order?id=${id}`;

  }

  showErrorModal(): void {
    const modalElement = document.getElementById('ErrorImportSingleOrderModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  hideModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
