import { Component, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal-import-all-products',
  imports: [],
  templateUrl: './modal-import-all-products.html',
  styleUrl: './modal-import-all-products.css',
})
export class ModalImportAllProducts {
  @Output() importAll = new EventEmitter<void>();
  @Input() marketplace!: number;
}
