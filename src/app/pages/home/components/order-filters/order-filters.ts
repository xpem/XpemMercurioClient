import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderStatus } from '../../../../models/order/order.model';

@Component({
  selector: 'app-order-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './order-filters.html',
  styleUrl: './order-filters.css',
})
export class OrderFilters {
  @Input() FilterFormGroup!: FormGroup;
  @Output() clearFilters = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClearClick(): void {
    console.log('Clear button clicked');
    this.clearFilters.emit();
  }

  setCheckboxOrderStatusValue(event: Event, statusValue: OrderStatus): void {
    const status = (this.FilterFormGroup.value.orderStatus as number[]) ?? [];
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.FilterFormGroup.value.orderStatus = [...status, statusValue];
    } else {
      this.FilterFormGroup.value.orderStatus = status.filter(s => s !== statusValue);
    }
  }
}
