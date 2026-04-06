import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { ShipmentService } from '../../../services/shipment-api';
import { Order } from '../../../models/order/order.model';
import { CurrencyPipe } from '@angular/common';
import { MercadoLivreService } from '../../../services/mercadoLivre/mercado-livre-api';
import { ShipmentGroupedTotalsRes } from '../../../models/shipment/shipment.totals.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shipment-pending-labels-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './shipment-pending-labels-list.html',
  styleUrl: './shipment-pending-labels-list.css',
})

export class ShipmentPendingLabelsList implements OnInit {
  isLoading: WritableSignal<boolean> = signal(true);
  selectedLabels: WritableSignal<string[]> = signal([]);
  totalSelectedLabels = computed(() => this.selectedLabels().length);
  marketplace: WritableSignal<number | null> = signal(null);
  ordersWithPendingLabels: WritableSignal<Order[]> = signal([]);
  ordersWithPendingNFe: WritableSignal<Order[]> = signal([]);
  //0 para etiquetas, 1 para NFe
  pageFunction: WritableSignal<number> = signal(0);
  groupedTotalsPendingShipments = signal<ShipmentGroupedTotalsRes | null>(null);

  private readonly printStatusBadgeClassMap: Record<number, string> = {
    0: 'text-bg-secondary',
    1: 'text-bg-success',
  };

  private readonly nFeStatusBadgeClassMap: Record<number, string> = {
    0: 'text-bg-secondary',
    1: 'text-bg-primary',
    2: 'text-bg-success',
    4: 'text-bg-primary',
    5: 'text-bg-success',
    3: 'text-bg-danger',
    6: 'text-bg-danger',
  };

  constructor(private toastService: ToastService, private shipmentService: ShipmentService, private mercadoLivreService: MercadoLivreService) { }

  toggleSelectAll() {
    if (this.totalSelectedLabels() === this.ordersWithPendingLabels().length) {
      this.selectedLabels.set([]);
    } else {
      this.selectedLabels.set(this.ordersWithPendingLabels().map(order => order.shipmentExternalId!));
    }
  }


  ngOnInit(): void {
    this.getOrdersWithPendingLabels();
    this.getGroupedTotalsPendingShipmentsToPrintLabels();
  }

  printSelectedLabels() {
    if (this.selectedLabels().length === 0) {
      this.toastService.showWarning('Nenhuma etiqueta selecionada para impressão.');
      return;
    }
    console.log('Label IDs to print:', this.selectedLabels().join(','));
  }

  setMarketplace(marketplace: number | null) {

    // if (this.totalPendingLabelsPrint() === 0)
    //   this.isEnabledPendingLabelsPrint.set(false);
    // else this.isEnabledPendingLabelsPrint.set(true);

    this.marketplace.set(marketplace);

    this.getOrdersWithPendingLabels();
    this.getGroupedTotalsPendingShipmentsToPrintLabels();
  }

  setPageFunction(pageFunction: number) {

    // if (this.totalPendingLabelsPrint() === 0)
    //   this.isEnabledPendingLabelsPrint.set(false);
    // else this.isEnabledPendingLabelsPrint.set(true);

    this.pageFunction.set(pageFunction);
    this.getOrdersWithPendingLabels();
    this.getGroupedTotalsPendingShipmentsToPrintLabels();
  }

  getPrintStatusBadgeClass(status: number | null | undefined): string {
    if (status == null) {
      return 'text-bg-secondary';
    }

    return this.printStatusBadgeClassMap[status] ?? 'text-bg-warning';
  }

  getInvoiceStatusBadgeClass(status: number | null | undefined): string {
    if (status == null) {
      return 'text-bg-secondary';
    }

    return this.nFeStatusBadgeClassMap[status] ?? 'text-bg-warning';
  }

  toggleLabelSelection(shipmentExternalId: string, event: Event): void {
    // Previne a propagação dupla quando clicar no checkbox
    event.stopPropagation();

    const currentSelected = this.selectedLabels();

    if (currentSelected.includes(shipmentExternalId)) {
      // Remove o ID da lista
      this.selectedLabels.set(currentSelected.filter(id => id !== shipmentExternalId));
    } else {
      // Adiciona o ID se ainda não estiver na lista
      this.selectedLabels.set([...currentSelected, shipmentExternalId]);
    }
  }

  getGroupedTotalsPendingShipmentsToPrintLabels() {
    this.shipmentService.getGroupedTotalsPendingShipmentsToPrintLabels(this.marketplace()).subscribe({
      next: (response) => {
        console.log('Grouped totals for pending shipments to print labels:', response);
        this.groupedTotalsPendingShipments.set(response);
      },
      error: (error: unknown) => {
        console.error('Error fetching grouped totals for pending shipments to print labels:', error);
        this.toastService.showError('Error fetching grouped totals for pending shipments to print labels.');
      }
    });
  }

  getOrdersWithPendingLabels() {
    this.isLoading.set(true);
    this.shipmentService.getOrdersWithPendingLabels(this.marketplace(), this.pageFunction()).subscribe({
      next: (response) => {
        console.log('Orders with pending labels:', response);
        this.ordersWithPendingLabels.set(response);

        this.selectedLabels.set(this.ordersWithPendingLabels().map(order => order.shipmentExternalId!));
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao obter pedidos com etiquetas pendentes:', error);
        this.toastService.showError('Erro ao obter pedidos com etiquetas pendentes.');
        this.isLoading.set(false);
      }
    });
  }
}
