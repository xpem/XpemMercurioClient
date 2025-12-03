import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../services/product-api';
import { Product } from '../../../models/Product/product.model';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { ProductBond } from '../../../models/product-Bond.model';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
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
  productBond: WritableSignal<ProductBond[]> = signal([]);
 isEditingQuantity: WritableSignal<boolean> = signal(false);

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder, private toastService: ToastService) { }

  ngOnInit(): void {

    //por enquanto o formgroup terá apenas a quantidade em estoque
    this.ProductForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(0)]],
    });

    this.isLoading.set(true);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
      this.productService.getbyId(+id).subscribe({
        next: (response) => {
          console.log('Product fetched successfully:', response);

          this.ProductForm.patchValue({
            quantity: response.quantity
          });

          if (response.productMercadoLivreBond) {
            var status = response.productMercadoLivreBond?.status;
            switch (status as number | string) {
              case 0:
                response.productMercadoLivreBond!.statusText = 'Ativo';
                break;
              case 1:
                response.productMercadoLivreBond!.statusText = 'Inativo';
                break;
              default:
                response.productMercadoLivreBond!.statusText = 'Desconhecido';
                break;
            }

            this.product.set(response);

            this.isLoading.set(false);
          }
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

  onEditQuantity(): void {
    const quantityControl = this.ProductForm.get('quantity');
    
    if (this.isEditingQuantity()) {
      // Se está editando, salvar as alterações
      if (this.ProductForm.valid) {
        this.onSubmit();
      } 
      // else {
      //   this.toastService.showWarning('Preencha o campo corretamente');
      // }
    } else {
      // Se não está editando, habilitar o campo
      quantityControl?.enable();
      this.isEditingQuantity.set(true);
    }
  }

    cancelEdit(): void {
    // Restaura o valor original e desabilita o campo
    this.ProductForm.patchValue({
      quantity: this.product().quantity || 0,
    });
    this.ProductForm.get('quantity')?.disable();
    this.isEditingQuantity.set(false);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage.set('');
    if (this.ProductForm.invalid) {
      return;
    }
    const updatedProduct: Product = {
      ...this.product(),
      quantity: this.ProductForm.value.quantity,
    };
    // this.productService.update(updatedProduct).subscribe({
    //   next: (response) => {
    //     console.log('Product updated successfully:', response);
    this.toastService.showSuccess('Produto atualizado com sucesso!');
    this.router.navigate(['/product-list']);
    //   },
    //   error: (error) => {
    //     console.error('Error updating product:', error);
    //     this.errorMessage.set('Erro ao atualizar o produto. Por favor, tente novamente.');
    //   }
    // });
  }
}
