import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { ShipmentService } from '../../../services/shipment-api';
import { Order } from '../../../models/order/order.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { MercadoLivreService } from '../../../services/mercadoLivre/mercado-livre-api';

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

  ordersWithPendingLabels: WritableSignal<Order[]> = signal([]);

  constructor(private toastService: ToastService, private shipmentService: ShipmentService, private mercadoLivreService: MercadoLivreService) { }

  toggleSelectAll() {
    if (this.totalSelectedLabels() === this.ordersWithPendingLabels().length) {
      this.selectedLabels.set([]);
    } else {
      this.selectedLabels.set(this.ordersWithPendingLabels().map(order => order.shipmentExternalId!));
    }
  }

  printSelectedLabels() {
    if (this.selectedLabels().length === 0) {
      this.toastService.showWarning('Nenhuma etiqueta selecionada para impressão.');
      return;
    }
    console.log('Label IDs to print:', this.selectedLabels().join(','));
    this.mercadoLivreService.printShipmentLabels(this.selectedLabels()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shipment_labels_batch.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // const printUrl = this.shipmentService.getPrintLabelsUrl(labelIds);
        this.toastService.showSuccess(`Lote de etiquetas gerado.`);

        this.getOrdersWithPendingLabels();
      },
      error: (error) => {
        this.toastService.showError('Erro ao gerar lote de etiquetas.');
        console.error('Erro ao gerar lote de etiquetas:', error);
      }
    });
  }


  ngOnInit(): void {
    this.getOrdersWithPendingLabels();
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

  getOrdersWithPendingLabels() {
    this.isLoading.set(true);
    this.shipmentService.getOrdersWithPendingLabels().subscribe({
      next: (response) => {
        console.log('Orders with pending labels:', response);
        this.ordersWithPendingLabels.set(response);

        this.toggleSelectAll();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao obter pedidos com etiquetas pendentes:', error);
        this.toastService.showError('Erro ao obter pedidos com etiquetas pendentes.');
        this.isLoading.set(false);
      }
    });
  }
}
