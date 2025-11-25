import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user-api';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';
import { Order } from '../../../models/Order/order.model';
import { Product } from '../../../models/Product/product.model';

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

  constructor(private userService: UserService, private MercadoLivreService: MercadoLivreService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('User profile:', response);

        var _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialId) {
          _userProfile.mercadoLivreCredentialId = response.mercadoLivreCredentialId;
        }

        this.userProfile.set(_userProfile);
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
      this.MercadoLivreService.importSingleOrder(orderId).subscribe({
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

  ImportSingleProduct() {
    const productIdInput = document.getElementById('productId') as HTMLInputElement;
    const productId = productIdInput.value.trim();
    this.errorMessage.set('');
    if (productId) {

      console.log('Importing product with ID:', productId);
      this.MercadoLivreService.importSingleProduct(productId).subscribe({
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
