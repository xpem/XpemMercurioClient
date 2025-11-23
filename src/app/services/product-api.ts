import { Injectable } from "@angular/core";
import { isExportDeclaration } from "typescript";
import { Total } from "../models/total.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/Product/product.model";

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
}