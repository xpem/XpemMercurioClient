import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OrderService } from '../../services/order-api';
import { InvoiceService } from '../../services/invoice-api';
import { MercadoLivreService } from '../../services/mercadoLivre/mercado-livre-api';
import { Order } from '../../models/order/order.model';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-order',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})

export class OrderDetail implements OnInit {
  order: WritableSignal<Order> = signal({} as Order);
  isLoading: WritableSignal<boolean> = signal(true);


  constructor(private orderService: OrderService, private invoiceService: InvoiceService,
    private mercadoLivreService: MercadoLivreService, private toastService: ToastService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isLoading.set(true);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      this.orderService.getbyId(+id).subscribe({
        next: (response) => {
          console.log('Order fetched successfully:', response);
          this.order.set(response);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          console.error('Error fetching order:', error);
          this.toastService.showError('Erro ao carregar o pedido. Por favor, tente novamente mais tarde.', 5000);
          this.isLoading.set(false);
        }
      });
    }
  }

  PrintLabelIsEnabled(): boolean {
    return this.order().marketPlace == "1" /*Mercado Livre*/ &&
      this.order().shipmentExternalId != null &&
      this.order().shipmentExternalId !== '' &&
      this.order().printStatus != null &&
      this.order().invoiceStatus != null &&
      this.order().invoiceStatus == 1 /*Emitida*/;
  }

  getNFeStatusBadgeClass(status: number | null | undefined): string {
    if (status == null) {
      return 'text-bg-secondary';
    }
    if (status == 7 /*Erro na emissão da NF-e*/) {
      return 'text-bg-danger';
    }

    return this.nFeStatusBadgeClassMap[status] ?? 'text-bg-warning';
  }

  retryInvoiceCreation(): void {
    this.order().invoiceErrorMessage = null;
    this.issueInvoice();

  }

  private readonly nFeStatusBadgeClassMap: Record<number, string> = {
    0: 'text-bg-secondary',
    1: 'text-bg-primary',
    2: 'text-bg-success',
    4: 'text-bg-primary',
    5: 'text-bg-success',
    3: 'text-bg-danger',
    6: 'text-bg-danger',
  };

  printShipmentLabel(): void {

    //verify if order.shipmentId is not null or empty
    if (!this.order().shipmentExternalId) {
      console.error('Shipment ID is null or empty');
      return;
    }

    var marketPlace = this.order().marketPlace;
    console.log('MarketPlace:', marketPlace);

    if (this.order().marketPlace == "1" /*Mercado Livre*/) {

      this.mercadoLivreService.printShipmentLabel(this.order().shipmentExternalId!).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `shipment_label_${this.order().shipmentExternalId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          this.toastService.showSuccess('Etiqueta de envio gerada com sucesso!', 5000);
        }
      });
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

  callModalConfirmationInvoiceIssue() {
    this.showModal('confirmationInvoiceIssueModal');
  }

  issueInvoice(): void {
    this.order().invoiceErrorMessage = null;
    this.order().invoiceStatus = 1 /*Pendente*/;
    this.order().invoiceStatusText = 'Em processo de emissão';
    this.hideModal('confirmationInvoiceIssueModal');
    this.invoiceService.issueNFe(this.order().id).subscribe({
      next: (response) => {
        console.log('NF-e issued successfully:', response);
        this.toastService.showSuccess(response, 5000);
        this.ngOnInit();
      },
      error: (error: unknown) => {
        console.error('Error issuing NF-e:', error);
        this.toastService.showError('Erro ao emitir a NF-e. Por favor, tente novamente mais tarde.', 5000);
      }
    });
  }

  downloadInvoiceXML(): void {
    this.invoiceService.getInvoiceXML(this.order().id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${this.order().invoiceKey}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastService.showSuccess('XML da NF-e baixado com sucesso!', 5000);
      },
      error: (error: unknown) => {
        console.error('Error downloading invoice XML:', error);
        this.toastService.showError('Erro ao baixar o XML da NF-e. Por favor, tente novamente mais tarde.', 5000);
      }
    });
  }
}