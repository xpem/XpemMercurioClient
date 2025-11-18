import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OrderService } from '../../services/MercadoLivre/order-api';
import { Order } from '../../models/Order/order.model';

@Component({
  selector: 'app-order',
  imports: [RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})

export class OrderDetail {
  orders: WritableSignal<Order> = signal({} as Order);
  isLoading: WritableSignal<boolean> = signal(true);
  
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.isLoading.set(false);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      this.orderService.getbyId(+id).subscribe({
        next: (response) => {
          console.log('Order fetched successfully:', response);
          this.orders.set(response);
        }
      });
    }
  }
}