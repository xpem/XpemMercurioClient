import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../services/product-api';
import { Product } from '../../../models/Product/product.model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { MercadoLivreService } from '../../../services/MercadoLivre/mercado-livre-api';
import { ProductBond } from '../../../models/Product/product-Bond.model';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, NgClass],
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
  mockMovementHistory: MovementHistoryItem[] = [
    { id: '1', type: 1, formattedType: 'entrada', quantity: 50, reason: 'Compra de fornecedor', date: '2024-01-15T10:30:00', formattedDate: '15/01/2024 10:30', balance: 50 },
    { id: '2', type: 2, formattedType: 'saida', quantity: 2, reason: 'Venda', saleId: 'MLB-001', date: '2024-01-16T14:20:00', formattedDate: '16/01/2024 14:20', balance: 48 },
    { id: '3', type: 2, formattedType: 'saida', quantity: 1, reason: 'Venda', saleId: 'MLB-002', date: '2024-01-17T09:15:00', formattedDate: '17/01/2024 09:15', balance: 47 },
    { id: '4', type: 1, formattedType: 'entrada', quantity: 20, reason: 'Reposição de estoque', date: '2024-01-20T11:00:00', formattedDate: '20/01/2024 11:00', balance: 67 },
    { id: '5', type: 2, formattedType: 'saida', quantity: 3, reason: 'Venda', saleId: 'MLB-003', date: '2024-01-22T16:45:00', formattedDate: '22/01/2024 16:45', balance: 64 },
    { id: '6', type: 2, formattedType: 'saida', quantity: 1, reason: 'Venda', saleId: 'SHP-001', date: '2024-01-23T08:30:00', formattedDate: '23/01/2024 08:30', balance: 63 },
    { id: '7', type: 2, formattedType: 'saida', quantity: 2, reason: 'Avaria/Perda', date: '2024-01-24T12:00:00', formattedDate: '24/01/2024 12:00', balance: 61 },
  ];
  editQuantityType: WritableSignal<number> = signal(0); // 1 para entrada, 2 para saída
  editNewQuantity: WritableSignal<number> = signal(0);

  constructor(private productService: ProductService,
    private router: Router, private fb: FormBuilder,
    private toastService: ToastService, private mercadoLivreService: MercadoLivreService) { }

  ngOnInit(): void {

    //por enquanto o formgroup terá apenas a quantidade em estoque
    this.ProductForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(0)]],
      type: [0, [Validators.required]],
      motive: ['', [Validators.required]],
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

  get f() { return this.ProductForm.controls; }


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
    const updatedProduct: Product = {
      ...this.product(),
      quantity: this.ProductForm.value.quantity,
    };

    this.productService.updateQuantity(updatedProduct.id, updatedProduct.quantity).subscribe({
      next: () => {
        this.toastService.showSuccess('Quantidade atualizada com sucesso!');

        this.product.set(updatedProduct);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage.set('Erro ao atualizar a quantidade. Por favor, tente novamente.');
      }
    });
  }

  onTypeChange(event: any): void {
    const selectedValue = event.target.value;
    this.editQuantityType.set(+selectedValue);
    this.onQuantityInput();
  }
}
