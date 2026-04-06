import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './product-filters.html',
  styleUrls: ['./product-filters.css'],
})
export class ProductFilters {
  @Input() FilterFormGroup!: FormGroup;
  @Output() clearFilters = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClearClick(): void {
    this.clearFilters.emit();
  }
}
