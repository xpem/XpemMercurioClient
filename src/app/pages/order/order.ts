import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order',
  imports: [RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})

export class Order {
  orders: WritableSignal<Order> = signal({} as Order);
  isLoading: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.isLoading.set(false);
  }
}