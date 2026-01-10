import { Injectable } from "@angular/core";

import { Total } from "../models/total.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product/product.model";
import { ProductQuantityHistory } from "../models/product/product-quantity-history.model";

@Injectable({
    providedIn: "root",
})

export class ProductService {
    private apiUrl = "/api/Product";

    constructor(private http: HttpClient) { }

    public getTotal(): Observable<Total> {
        return this.http.get<Total>(`${this.apiUrl}/totals`);
    }

    public get(page: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}?page=${page}`);
    }

    public getbyId(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    public updateQuantity(id: number, quantity: number, reason: string, type: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/quantity`, { quantityMoved: quantity, reason, type });
    }

    public getQuantityHistory(productId: number, page: number): Observable<ProductQuantityHistory[]> {
        return this.http.get<ProductQuantityHistory[]>(`${this.apiUrl}/${productId}/quantity/historic?page=${page}`);
    }
}