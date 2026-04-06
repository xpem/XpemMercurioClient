import { Directive, Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';
import { UserService } from '../../services/user-api';
import { UserProfile } from '../../models/user-profile.model';
import { OrderService } from '../../services/order-api';
import { Order, OrderStatus } from '../../models/Order/order.model';
import { CurrencyPipe } from '@angular/common';
import { ShipmentService } from '../../services/shipment-api';
import { OrderFilter, OrderFilterDisplay } from '../../models/Order/order-filter.model';
import { OrderFilters } from "./components/order-filters/order-filters";
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { TooltipDirective } from '../../components/TooltipDirective';


@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, OrderFilters, RouterModule, TooltipDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})



export class Home implements OnInit {

  userProfile: WritableSignal<UserProfile | null> = signal(null);
  orders: WritableSignal<Order[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(20);
  totalPages: WritableSignal<number> = signal(1);
  totalOrders: WritableSignal<number> = signal(0);
  totalPendingLabelsPrint: WritableSignal<number> = signal(0);
  orderFilter: WritableSignal<OrderFilter> = signal({});
  isLoadingTotalPendingLabelsPrint: WritableSignal<boolean> = signal(true);
  isEnabledPendingLabelsPrint: WritableSignal<boolean> = signal(true);
  //filters
  orderFilterDisplay: WritableSignal<OrderFilterDisplay> = signal({
    externalId: '',
    createdAfter: '',
    createdBefore: '',
    productId: '',
    productSKU: '',
    productName: '',
    status: '',
    marketplace: '',
  });

  isActiveFilter: WritableSignal<boolean> = signal(false);
  marketplace: WritableSignal<number | null> = signal(null);
  orderFilterForm: FormGroup;
  pages = computed(() => {
    const tp = this.totalPages();
    const current = this.currentPage();
    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);

    let start = Math.max(1, current - halfWindow);
    let end = Math.min(tp, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }

    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });
  //por enquantro fixo como 1 (Mercado Livre)

  constructor(
    private toastService: ToastService,
    private shipmentService: ShipmentService,
    private mercadoLivreService: MercadoLivreService,
    private orderService: OrderService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderFilterForm = this.fb.group(
      {
        orderExternalId: [''],
        orderDateStart: [null],
        orderDateEnd: [null],
        orderProductId: [''],
        orderProductName: [''],
        orderStatus: [[]],
        orderProductSKU: ['']
      },
      { validators: this.dateRangeValidator() }
    );
  }

  ngOnInit(): void {
    this.isLoading.set(true);

    // Executa as 3 requisições em paralelo, mas de forma independente
    forkJoin({
      profile: this.userService.getUserProfile().pipe(
        catchError(error => {
          console.error('Error loading user profile:', error);
          return of(null);
        })
      ),
      totals: this.orderService.getTotalOrders(this.orderFilter(), this.marketplace()).pipe(
        catchError(error => {
          console.error('Error loading order totals:', error);
          return of({ totalItems: 0, totalPages: 0 });
        })
      ),
      pending: this.shipmentService.getPendingLabelsPrintCount().pipe(
        catchError(error => {
          console.error('Error loading pending labels count:', error);
          return of(0);
        })
      )
    }).subscribe({
      next: ({ profile, totals, pending }) => {
        // Processa o perfil do usuário
        if (profile) {
          const profileData = {} as UserProfile;
          if (profile.mercadoLivreCredentialId != null) {
            profileData.mercadoLivreCredentialId = profile.mercadoLivreCredentialId;
          }
          if (profile.shopeeCredentialId != null) {
            profileData.shopeeCredentialId = profile.shopeeCredentialId;
          }
          this.userProfile.set(profileData);
        }

        // Processa os totais
        this.totalOrders.set(totals.totalItems);
        this.totalPages.set(totals.totalPages);

        // Processa etiquetas pendentes
        this.totalPendingLabelsPrint.set(pending);
        this.isLoadingTotalPendingLabelsPrint.set(false);

        // Carrega as ordens paginadas
        this.loadPaginatedOrders(1);
      }
    });
  }

  initLoadOrders() {
    this.isLoading.set(true);
    this.orderService.getTotalOrders(this.orderFilter(), this.marketplace()).subscribe({
      next: (response) => {
        const totalOrders = response.totalItems;
        const totalPages = response.totalPages;

        this.totalOrders.set(totalOrders);
        this.totalPages.set(totalPages);

        this.loadPaginatedOrders(1);
      }
    });
  }


  // Validador customizado que compara datas
  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control as FormGroup;
      if (!parent.get) return null;

      const startDate = parent.get('orderDateStart')?.value;
      const endDate = parent.get('orderDateEnd')?.value;

      // Se ambos os campos estão preenchidos, valida se startDate < endDate
      if (startDate && endDate && startDate > endDate) {
        return { dateRangeInvalid: true };
      }

      return null;
    };
  }

  goToOrderDetail(id: number) {
    this.router.navigate(['/order'], { queryParams: { id } });
  }

  goToShipmentPendingLabelsList() {
    this.router.navigate(['/shipment-pending-labels-list']);
  }

  goToCredentialBondList() {
    this.router.navigate(['/bond-list']);
  }

  setMarketplace(marketplace: number | null) {

    if (this.totalPendingLabelsPrint() === 0)
      this.isEnabledPendingLabelsPrint.set(false);
    else this.isEnabledPendingLabelsPrint.set(true);

    this.marketplace.set(marketplace);
    this.initLoadOrders();
  }

  clearFilters(): void {

    if (this.isActiveFilter() === true) {
      //reload total orders and total pages without filter
      this.initLoadOrders();
    }

    this.orderFilter.set({});
    this.isActiveFilter.set(false);
    this.orderFilterDisplay.set({
      externalId: '',
      createdAfter: '',
      createdBefore: '',
      productId: '',
      productSKU: '',
      productName: '',
      status: '',
      marketplace: '',
    });
    this.orderFilterForm.value.orderStatus = [] as number[];
    this.orderFilterForm.reset();
  }

  onOrderFiltersFormSubmit(): void {

    // Validar se a data inicial é menor que a data final
    if (this.orderFilterForm.hasError('dateRangeInvalid')) {
      this.toastService.showError('A data inicial não pode ser maior que a data final!', 5000);
      return;
    }

    this.isActiveFilter.set(true);

    const currentDisplay: OrderFilterDisplay = { ...this.orderFilterDisplay() };

    if (this.orderFilterForm.value.orderExternalId !== null && this.orderFilterForm.value.orderExternalId !== '') {
      currentDisplay.externalId = `Id da venda: #${this.orderFilterForm.value.orderExternalId}`;
    }

    if (this.orderFilterForm.value.orderDateStart !== null) {
      currentDisplay.createdAfter = `De: ${this.formatDate(this.orderFilterForm.value.orderDateStart)}`;
    }

    if (this.orderFilterForm.value.orderDateEnd !== null) {
      currentDisplay.createdBefore = `Até: ${this.formatDate(this.orderFilterForm.value.orderDateEnd)}`;
    }

    if (this.orderFilterForm.value.orderProductId !== null && this.orderFilterForm.value.orderProductId !== '') {
      currentDisplay.productId = `Id do produto: #${this.orderFilterForm.value.orderProductId}`;
    }

    if (this.orderFilterForm.value.orderProductSKU !== null && this.orderFilterForm.value.orderProductSKU !== '') {
      currentDisplay.productSKU = `SKU do produto: ${this.orderFilterForm.value.orderProductSKU}`;
    }

    if (this.orderFilterForm.value.orderProductName !== null && this.orderFilterForm.value.orderProductName !== '') {
      currentDisplay.productName = `Nome do produto: ${this.orderFilterForm.value.orderProductName}`;
    }

    if (this.orderFilterForm.value.orderStatus !== null && this.orderFilterForm.value.orderStatus.length > 0) {
      let statusesText = this.orderFilterForm.value.orderStatus
        .map((status: OrderStatus) => OrderStatus[status])
        .join(', ');
      currentDisplay.status = `Situações: ${statusesText}`;
    }

    this.orderFilterDisplay.set(currentDisplay);
    this.orderFilter.set({
      orderExternalId: this.orderFilterForm.value.orderExternalId,
      createdAfter: this.orderFilterForm.value.orderDateStart,
      createdBefore: this.orderFilterForm.value.orderDateEnd,
      productExternalId: this.orderFilterForm.value.orderProductId,
      productName: this.orderFilterForm.value.orderProductName,
      orderStatus: this.orderFilterForm.value.orderStatus,
      productSKU: this.orderFilterForm.value.orderProductSKU,
      marketplace: this.marketplace(),
    });

    this.initLoadOrders();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadPaginatedOrders(page);
  }

  loadPaginatedOrders(page: number) {
    this.isLoading.set(true);
    this.orderService.get(page, this.orderFilter(), this.marketplace()).subscribe({
      next: (response) => {
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

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
}
