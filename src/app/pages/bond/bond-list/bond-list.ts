import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../../models/user-profile.model';
import { UserService } from '../../../services/user-api';
import { MercadoLivreService } from '../../../services/mercadoLivre/mercado-livre-api';
import { Order } from '../../../models/order/order.model';
import { Product } from '../../../models/product/product.model';
import { ToastService } from '../../../services/toast.service';
import { ShopeeApiService } from '../../../services/mercadoLivre/shopee-api';
import { ModalImportAllProducts } from './components/modal-import-all-products/modal-import-all-products';
import { ModalImportSingleProduct } from "./components/modal-import-single-product/modal-import-single-product";

declare const bootstrap: any;

@Component({
  selector: 'app-bond-list',
  imports: [ModalImportAllProducts, ModalImportSingleProduct],
  templateUrl: './bond-list.html',
  styleUrl: './bond-list.css',
})
export class BondList implements OnInit {
  userProfile: WritableSignal<UserProfile | null> = signal(null);
  SingleImportOrders: WritableSignal<Order[]> = signal([]);
  SingleProduct: WritableSignal<Product | null> = signal(null);
  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(true);
  isImportLoading: WritableSignal<boolean> = signal(false);
  isActionLoading: WritableSignal<boolean> = signal(false);
  selectedMarketplace: WritableSignal<number> = signal(0);
  productId: WritableSignal<string> = signal('');

  todayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private userService: UserService, private mercadoLivreService: MercadoLivreService,
    private shopeeApiService: ShopeeApiService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getUserProfile()
  }

  getUserProfile() {
    this.isLoading.set(true);
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        const _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialId) {
          _userProfile.mercadoLivreCredentialId = response.mercadoLivreCredentialId;
        } else
          _userProfile.mercadoLivreCredentialId = null;

        if (response.shopeeCredentialId) {
          _userProfile.shopeeCredentialId = response.shopeeCredentialId;
        } else
          _userProfile.shopeeCredentialId = null;

        this.userProfile.set(_userProfile);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  importSingleOrder() {
    if (this.selectedMarketplace() === 1) {
      this.executeImportSingleOrder(
        (orderId: string) => this.mercadoLivreService.importSingleOrder(orderId)
      );
      return;
    }

    this.executeImportSingleOrder(
      (orderId: string) => this.shopeeApiService.importSingleOrder(orderId)
    );
  }

  executeImportSingleOrder(importObservable: any) {
    this.isImportLoading.set(true);
    const orderIdInput = document.getElementById('orderId') as HTMLInputElement;
    const orderId = orderIdInput.value.trim();
    this.errorMessage.set('');
    if (orderId) {

      console.log('Importing order with ID:', orderId);
      importObservable(orderId).subscribe({
        next: (response: any) => {

          const responseData = this.parseOrdersResponse(response);

          this.SingleImportOrders.set(responseData);

          console.log('Order imported successfully:', this.SingleImportOrders());

          for (const order of this.SingleImportOrders()) {
            console.log(`Importação do pedido ${order.externalId} em processamento!`);
          }

          //external id of SingleOrder
          this.showModal('ConfirmImportSingleOrderModal');
          this.hideModal('ImportSingleOrderModal');
          this.isImportLoading.set(false);
        },
        error: (error: any) => {
          console.error('Error importing single order:', error);
          this.showModal('ErrorImportSingleModal');
          this.hideModal('ImportSingleOrderModal');
          this.errorMessage.set(error?.message || 'An error occurred while importing the order.');
          this.isImportLoading.set(false);
        }
      });
    }
  }

  private parseOrdersResponse(response: unknown): Order[] {
    if (Array.isArray(response)) {
      return response as Order[];
    }

    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) {
          return parsed as Order[];
        }

        if (parsed && typeof parsed === 'object') {
          return [parsed as Order];
        }

        return [];
      } catch {
        return [];
      }
    }

    if (response && typeof response === 'object') {
      return [response as Order];
    }

    return [];
  }

  importOrdersByPeriod() {
    if (this.selectedMarketplace() === 1) {
      this.executeImportOrdersByPeriod(
        (startDate: string, endDate: string) => this.mercadoLivreService.importOrdersByPeriod(startDate, endDate)
      );
      return;
    }

    this.executeImportOrdersByPeriod(
      (startDate: string, endDate: string) => this.shopeeApiService.importOrdersByPeriod(startDate, endDate)
    );
  }

  executeImportOrdersByPeriod(importObservable: any) {
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
      importObservable(startDate, endDate).subscribe({
        next: (response: any) => {
          console.log('Orders imported successfully:', response);
          this.toastService.showInfo('Importação de pedidos em processamento!', 5000);
          this.hideModal('importOrdersByPeriodModal');
          this.getUserProfile()
        },
        error: (error: any) => {
          console.error('Error importing orders by period:', error);
          this.showModal('ErrorImportSingleModal');
          this.hideModal('importOrdersByPeriodModal');
          this.errorMessage.set(error?.message || 'An error occurred while importing orders by period.');
        }
      });
    }
  }

  onProductIdChange(productId: string) {
    this.productId.set(productId);
  }

  callImportSingleProduct(marketplace: number) {
    this.selectedMarketplace.set(marketplace);
    this.showModal('ImportSingleProductModal');
  }

  callUnbondCredential(marketplace: number) {
    this.selectedMarketplace.set(marketplace);
    this.showModal('unbondMercadoLivreCredentialModal');
  }

  callImportOrdersByPeriodModal(marketplace: number) {
    this.selectedMarketplace.set(marketplace);
    this.showModal('importOrdersByPeriodModal');
  }

  callImportSingleOrderModal(marketplace: number) {
    this.selectedMarketplace.set(marketplace);
    this.showModal('ImportSingleOrderModal');
  }

  importSingleProduct() {
    if (this.selectedMarketplace() === 1) {
      this.executeImportSingleProduct(
        (productId: string) => this.mercadoLivreService.importSingleProduct(productId)
      );
      return;
    }

    this.executeImportSingleProduct(
      (productId: string) => this.shopeeApiService.importSingleProduct(productId)
    );
  }

  executeImportSingleProduct(importObservable: any) {
    const productId = this.productId();
    this.isImportLoading.set(true);
    this.errorMessage.set('');
    if (productId) {

      console.log('Importing product with ID:', productId);
      importObservable(productId).subscribe({
        next: (response: any) => {
          this.toastService.showInfo('Produto importado com sucesso!', 5000);
          this.hideModal('ImportSingleProductModal');
          this.isImportLoading.set(false);
        },
        error: (error: any) => {
          console.log('Error object:', error.error.message);
          this.showModal('ErrorImportModal');
          this.hideModal('ImportSingleProductModal');
          this.isImportLoading.set(false);
          this.errorMessage.set(error?.error?.message || 'An error occurred while importing the product.');
        }
      });
    }
  }

  bondMercadoLivre() {

    if (this.isActionLoading()) {
      return; // Previne múltiplos cliques
    }
    this.isActionLoading.set(true);
    this.mercadoLivreService.getAuthUri().subscribe({
      next: (response) => {
        console.log('url de autenticação do Mercado Livre:', response);
        // a response é uma URL de redirecionamento
        window.location.href = response;
      },
      error: (error: unknown) => {
        console.error('Erro ao conectar com o Mercado Livre:', error);
        this.isActionLoading.set(false);
      }
    });
  }

  bondShopee() {
    if (this.isActionLoading()) {
      return; // Previne múltiplos cliques
    }
    this.isActionLoading.set(true);
    this.shopeeApiService.getAuthUri().subscribe({
      next: (response) => {
        console.log('url de autenticação da Shopee:', response);
        // a response é uma URL de redirecionamento
        window.location.href = response;
      },
      error: (error: unknown) => {
        console.error('Erro ao conectar com a Shopee:', error);
        this.isActionLoading.set(false);
      }
    });
  }

  unBondShopee() {

    if (this.isActionLoading()) {
      return; // Previne múltiplos cliques
    }

    this.isActionLoading.set(true);

    this.shopeeApiService.getCancelAuthUri(this.userProfile()?.shopeeCredentialId || '').subscribe({
      next: (response) => {
        console.log('url de cancelamento de autenticação da Shopee:', response);
        // a response é uma URL de redirecionamento
        window.location.href = response;
      },
      error: (error: unknown) => {
        console.error('Erro ao desconectar da Shopee:', error);
        this.isActionLoading.set(false);
      }
    });
  }

  inactivateMercadoLivreCredential() {

    let credentialId: string | null | undefined = null;

    if (this.selectedMarketplace() === 1) {
      credentialId = this.userProfile()?.mercadoLivreCredentialId;
    } else if (this.selectedMarketplace() === 2) {
      credentialId = this.userProfile()?.shopeeCredentialId;
    }

    if (!credentialId) {
      console.error('Credential ID is undefined');
      this.toastService.showError('ID da credencial indefinido!', 5000);
      return;
    }

    this.mercadoLivreService.inactivateCredential(credentialId).subscribe({
      next: (response) => {
        console.log('Credential inactivated successfully:', response);
        this.toastService.showSuccess('Credencial desativada com sucesso!', 5000);
        //dismiss modal
        this.hideModal('unbondMercadoLivreCredentialModal');
        this.getUserProfile();
      },
      error: (error: unknown) => {
        console.error('Error inactivating credential:', error);
        this.toastService.showError('Erro ao desativar credencial!', 5000);
      }
    });
  }

  callImportAllProducts(marketplace: number) {
    this.selectedMarketplace.set(marketplace);
    this.showModal('importProductsModal');
  }

  importAllProducts() {
    if (this.selectedMarketplace() === 1) {
      this.importAllProductsFromMarketplace(
        this.mercadoLivreService.importAllProducts()
      );
      return;
    }

    this.importAllProductsFromMarketplace(
      this.shopeeApiService.importAllProducts()
    );
  }

  private importAllProductsFromMarketplace(importObservable: any) {
    this.isImportLoading.set(true);
    this.errorMessage.set('');
    importObservable.subscribe({
      next: (response: any) => {
        console.log('All products imported successfully:', response);
        this.toastService.showInfo('Importação de todos os produtos em processamento!', 5000);
        this.hideModal("importProductsModal");
        this.isImportLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error importing all products:', error);
        this.showModal('ErrorImportModal');
        this.hideModal("importProductsModal");
        this.isImportLoading.set(false);
        this.errorMessage.set(error?.message || 'An error occurred while importing all products.');
      }
    });
  }

  goToOrderDetail(id: number | undefined) {
    //navegar para a pagina order passando o externalId como parametro
    window.location.href = `/order?id=${id}`;

  }

  goToProductDetail(id: number | undefined) {
    //navegar para a pagina product passando o publicId como parametro
    window.location.href = `/product-detail?id=${id}`;
  }

  showErrorModal(): void {
    const modalElement = document.getElementById('ErrorImportModal');
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
