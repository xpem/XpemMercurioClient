import { Component, Input } from '@angular/core';
import { ProductQuantityHistory } from '../../../../../models/Product/product-quantity-history.model';

@Component({
  selector: 'app-movement-history',
  imports: [],
  templateUrl: './movement-history.html',
  styleUrls: ['./movement-history.css'],
})
export class MovementHistoryComponent {
  @Input() movementHistory: ProductQuantityHistory[] = [];
  @Input() isLoading: boolean = true;
  @Input() productTitle: string = '';
}
