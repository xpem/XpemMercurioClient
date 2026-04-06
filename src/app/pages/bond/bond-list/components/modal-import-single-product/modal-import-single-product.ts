import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-import-single-product',
  imports: [],
  templateUrl: './modal-import-single-product.html',
  styleUrl: './modal-import-single-product.css',
})
export class ModalImportSingleProduct {
    @Output() importSingleProduct = new EventEmitter<void>();

    //pass productId to parent component
    @Output() productIdChange = new EventEmitter<string>();

}
