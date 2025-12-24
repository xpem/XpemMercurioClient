import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

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
}
