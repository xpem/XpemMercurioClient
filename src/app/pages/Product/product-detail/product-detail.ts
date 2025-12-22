import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../services/product-api';
import { Product } from '../../../models/Product/product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';
import { ProductBond } from '../../../models/Product/product-Bond.model';
import { MovementHistoryComponent } from './components/movement-history/movement-history';
import { ProductQuantityHistory } from '../../../models/Product/product-quantity-history.model';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, NgClass, MovementHistoryComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})

export class ProductDetail implements OnInit {
  isLoading: WritableSignal<boolean> = signal(true);
  product: WritableSignal<Product> = signal({} as Product);
  submitted = false;
  // errorMessage: string = '';
  errorMessage: WritableSignal<string> = signal('');
  ProductForm!: FormGroup;
  productBonds: WritableSignal<ProductBond[]> = signal([]);
  isLoadingQuantityHistory: WritableSignal<boolean> = signal(true);
  productQuantityHistory: WritableSignal<ProductQuantityHistory[]> = signal([]);
  editQuantityType: WritableSignal<number> = signal(0); // 1 para entrada, 2 para saída
  editNewQuantity: WritableSignal<number> = signal(0);
  hasMoreQuantityHistory: WritableSignal<boolean> = signal(false);
  currentPageProductQuantityHistory: number = 1;

  constructor(private productService: ProductService,
    private router: Router, private fb: FormBuilder,
    private toastService: ToastService, private mercadoLivreService: MercadoLivreService) { }

  ngOnInit(): void {

    //por enquanto o formgroup terá apenas a quantidade em estoque
    this.ProductForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(0)]],
      type: [0, [Validators.required]],
      reason: ['', [Validators.required]],
    });

    this.isLoading.set(true);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      this.productService.getbyId(+id).subscribe({
        next: (response) => {
          console.log('Product fetched successfully:', response);
          this.product.set(response);

          this.mercadoLivreService.importProductBonds(response.id).subscribe({
            next: (bondResponse) => {
              console.log('Product bonds fetched successfully:', bondResponse);

              this.productBonds.set(bondResponse);

              // Definir statusText e statusClassColor com base no status numérico
              for (let bond of this.productBonds()) {
                if (bond) {
                  var status = bond?.status;
                  switch (status as number | string) {
                    case 0:
                      bond!.statusText = 'Ativo';
                      bond!.statusClassColor = 'success';
                      break;
                    case 1:
                      bond!.statusText = 'Pausado';
                      bond!.statusClassColor = 'warning';
                      break;
                    case 2:
                      bond!.statusText = 'Inativo';
                      bond!.statusClassColor = 'danger';
                      break;
                    default:
                      bond!.statusText = 'Desconhecido';
                      bond!.statusClassColor = 'secondary';
                      break;
                  }
                }
              }
            },
            error: (error) => {
              console.error('Error fetching product bonds:', error);
            }
          });

          this.isLoading.set(false);

        },
        error: (error) => {
          console.error('Error fetching product:', error);
          this.errorMessage.set('Erro ao carregar o produto. Por favor, tente novamente.');
          this.isLoading.set(false);
        }
      });
    }
  }

  getQuantityHistoric(): void {
    this.isLoadingQuantityHistory.set(true);
    this.productQuantityHistory.set([]);
    this.currentPageProductQuantityHistory = 1;
    this.loadMoreQuantityHistory();
  }

  loadMoreQuantityHistory(): void {
    const pageSize = 15;
    this.productService.getQuantityHistory(this.product().id, this.currentPageProductQuantityHistory).subscribe({
      next: (response) => {

        //caso o response type seja 0, definir o formattedType como 'entrada', se for 1, definir como 'saida'
        //tratar a data para o formato dd/MM/yyyy HH:mm
        for (let item of response) {
          if (item.type === 0) {
            item.formattedType = 'entrada';
          } else if (item.type === 1) {
            item.formattedType = 'saida';
          }
        }

        console.log('Quantity history fetched successfully:', response);
        //add response to movementHistory array
        this.productQuantityHistory.set([...this.productQuantityHistory(), ...response]);
        this.isLoadingQuantityHistory.set(false);

        if (response.length === pageSize)
          this.hasMoreQuantityHistory.set(true);
        else
          this.hasMoreQuantityHistory.set(false);

      },
      error: (error) => {
        console.error('Error fetching quantity history:', error);
        this.isLoadingQuantityHistory.set(false);
      }
    });
  }

  get f() { return this.ProductForm.controls; }

  movementHistoryLoadMore = (): void => {
    this.isLoadingQuantityHistory.set(true);
    this.currentPageProductQuantityHistory++;
    this.loadMoreQuantityHistory();
  }

  onQuantityInput(): void {
    if (this.ProductForm.value.quantity === undefined || this.ProductForm.value.quantity == 0) { return; }

    const inputQuantity = this.ProductForm.value.quantity;
    const currentQuantity = this.product().quantity;
    const type = this.editQuantityType();
    let newQuantity = currentQuantity;
    if (type === 0) { // entrada
      newQuantity = currentQuantity + inputQuantity;
    } else if (type === 1) { // saída
      newQuantity = currentQuantity - inputQuantity;
    }
    this.editNewQuantity.set(newQuantity);
  }

  onSubmit() {
    this.submitted = true;
    this.ProductForm.markAllAsTouched();
    this.ProductForm.updateValueAndValidity();
    this.errorMessage.set('');

    if (this.ProductForm.invalid) {
      return;
    }

    this.productService.updateQuantity(this.product().id, this.ProductForm.value.quantity, this.ProductForm.value.reason, this.editQuantityType()).subscribe({
      next: () => {
        this.toastService.showSuccess('Quantidade atualizada com sucesso!');

        const updatedProduct: Product = {
          ...this.product(),
          quantity: this.editNewQuantity(),
        };

        this.product.set(updatedProduct);

        // Reset form state
        this.submitted = false;
        this.ProductForm.reset();
        this.editNewQuantity.set(0);

      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.toastService.showError('Erro ao atualizar a quantidade. Por favor, tente novamente.');
      }
    });
  }

  onTypeChange(event: any): void {
    const selectedValue = event.target.value;
    this.editQuantityType.set(+selectedValue);
    this.onQuantityInput();
  }
}
