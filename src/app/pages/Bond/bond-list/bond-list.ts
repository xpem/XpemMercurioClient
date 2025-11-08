import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user-api';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';
import { Order } from '../../../models/Order/order.model';

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

  constructor(private userService: UserService, private MercadoLivreService: MercadoLivreService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('User profile:', response);

        var _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialid) {
          _userProfile.mercadoLivreCredentialid = response.mercadoLivreCredentialid;
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

    if (orderId) {

      console.log('Importing order with ID:', orderId);
      this.MercadoLivreService.importSingleOrder(orderId).subscribe({
        next: (response) => {

          const order: Order = response;
          this.SingleOrder.set(order);

          console.log('Import single order response:', response);
          console.log('order value:', order);

          

          console.log('SingleOrder signal value:', this.SingleOrder());

          //external id of SingleOrder
          const externalId = order.externalId;
          console.log('External ID of imported order:', externalId);

          this.showModal('ConfirmImportSingleOrderModal');
          this.hideModal('ImportSingleOrderModal');
        },
        error: (error) => {
          console.error('Error importing single order:', error);
          this.showModal('ErrorImportSingleOrderModal');
          this.hideModal('ImportSingleOrderModal');
        }
      });
    }
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
