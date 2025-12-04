import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OrderService } from '../../services/order-api';
import { MercadoLivreService } from '../../services/MercadoLivre/mercado-livre-api';
import { Order } from '../../models/Order/order.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-order',
  imports: [RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})

export class OrderDetail  implements OnInit {
  order: WritableSignal<Order> = signal({} as Order);
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(private orderService: OrderService, private mercadoLivreService: MercadoLivreService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.isLoading.set(false);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      this.orderService.getbyId(+id).subscribe({
        next: (response) => {
          console.log('Order fetched successfully:', response);
          this.order.set(response);
        }
      });
    }
  }

  printShipmentLabel(): void {

    //verify if order.shipmentId is not null or empty
    if (!this.order().shipmentId) {
      console.error('Shipment ID is null or empty');
      return;
    }

    var marketPlace = this.order().marketPlace;
    console.log('MarketPlace:', marketPlace);
    if (this.order().marketPlace == "1" /*Mercado Livre*/) {

      this.mercadoLivreService.printShipmentLabel(this.order().shipmentId!).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `shipment_label_${this.order().shipmentId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          this.toastService.showSuccess('Etiqueta de envio gerada com sucesso!', 5000);
        }
      });
    }
  }
}