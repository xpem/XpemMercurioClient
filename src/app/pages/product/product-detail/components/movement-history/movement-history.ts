import { Component, Input, WritableSignal } from '@angular/core';
import { ProductQuantityHistory } from '../../../../../models/product/product-quantity-history.model';

@Component({
  selector: 'app-movement-history',
  imports: [],
  templateUrl: './movement-history.html',
  styleUrls: ['./movement-history.css'],
})
export class MovementHistoryComponent {
  @Input() productQuantityHistory:  ProductQuantityHistory[] = [];;
  @Input() isLoading: boolean = true;
  @Input() productTitle: string = '';
  @Input() hasMore: boolean = false;
  @Input() movementHistoryLoadMore!: () => void;
}
