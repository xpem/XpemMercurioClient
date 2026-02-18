import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { Product } from '../../../models/product/product.model';
import { ProductService } from '../../../services/product-api';
import { CurrencyPipe } from '@angular/common';
import { ProductFilter, ProductFilterDisplay } from '../../../models/product/product-filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductFilters } from "./product-filters/product-filters";

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, ProductFilters],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})

export class ProductList implements OnInit {

  isLoading: WritableSignal<boolean> = signal(true);
  products: WritableSignal<Product[]> = signal([]);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(20);
  totalPages: WritableSignal<number> = signal(1);
  total: WritableSignal<number> = signal(0);
  productFilter: WritableSignal<ProductFilter> = signal({});
  productFilterDisplay: WritableSignal<ProductFilterDisplay> = signal({});
  productFilterForm: FormGroup;
  isActiveFilter: WritableSignal<boolean> = signal(false);

  constructor(private ProductService: ProductService, private fb: FormBuilder) {
    this.productFilterForm = this.fb.group({
      productTitle: [''],
      productSKU: [''],
      productBondExternalId: ['']
    });
  }

  pages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 7; // número máximo de botões de página visíveis

    if (total <= maxVisible) {
      // Se total de páginas for menor que o máximo, mostra todas
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisible - 1);

    // Ajusta o início se estiver muito próximo do fim
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  ngOnInit(): void {
    this.isLoading.set(true);

    this.ProductService.getTotal().subscribe({
      next: (response) => {
        const totalProducts = response.totalItems;
        const totalPages = response.totalPages;
        this.total.set(totalProducts);
        this.totalPages.set(totalPages);
        console.log('Total products:', response);
        this.loadProducts(this.currentPage());
      }
    });
  }

  initLoadProducts(): void {
    this.isLoading.set(true);
    this.ProductService.getTotal(this.productFilter()).subscribe({
      next: (response) => {
        const totalProducts = response.totalItems;
        const totalPages = response.totalPages;
        this.total.set(totalProducts);
        this.totalPages.set(totalPages);
        console.log('Total products with filter:', response);
        this.loadProducts(1);
      }
    });
  }

  loadProducts(page: number): void {
    this.isLoading.set(true);
    this.ProductService.get(page, this.productFilter()).subscribe({
      next: (response) => {
        console.log('Products on page', page, ':', response);
        this.products.set(response);
        this.currentPage.set(page);
        this.isLoading.set(false);
      }
    });
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadProducts(page);
  }

  goToDetail(id: any) {
    //navegar para a pagina order passando o externalId como parametro
    window.location.href = `Product/Detail?id=${id}`;
  }

  clearFilters(): void {

    if (this.isActiveFilter() === true) {
      //reload total orders and total pages without filter
      this.initLoadProducts();
    }

    this.productFilter.set({});
    this.productFilterDisplay.set({});
    this.productFilterForm.reset();
    this.isActiveFilter.set(false);
  }

  onProductFiltersFormSubmit(): void {

    this.isActiveFilter.set(true);

    const currentDisplay: ProductFilterDisplay = { ...this.productFilterDisplay() };

    if (this.productFilterForm.value.productSKU !== null && this.productFilterForm.value.productSKU !== '') {
      currentDisplay.productSKU = `SKU do produto: ${this.productFilterForm.value.productSKU}`;
    }

    if (this.productFilterForm.value.productTitle !== null && this.productFilterForm.value.productTitle !== '') {
      currentDisplay.productTitle = `Nome do produto: ${this.productFilterForm.value.productTitle}`;
    }

    if (this.productFilterForm.value.productBondExternalId !== null && this.productFilterForm.value.productBondExternalId !== '') {
      currentDisplay.productBondExternalId = `Id no Marketplace: ${this.productFilterForm.value.productBondExternalId}`;
    }

    this.productFilterDisplay.set(currentDisplay);

    this.productFilter.set({
      productSKU: this.productFilterForm.value.productSKU,
      productTitle: this.productFilterForm.value.productTitle,
      productBondExternalId: this.productFilterForm.value.productBondExternalId
    });

    this.initLoadProducts();
  }

}