import { HttpClient } from "@angular/common/http";
import { Total } from "../models/total.model";
import { Observable } from "rxjs";
import { Order } from "../models/Order/order.model";
import { Injectable } from "@angular/core";
import { OrderFilter } from "../models/Order/order-filter.model";

@Injectable({
    providedIn: "root",
})

export class OrderService {
    private apiUrl = "/api/Order";

    constructor(private http: HttpClient) { }

    public getTotalOrders(isActiveFilter: boolean, filter: OrderFilter, marketPlace: number): Observable<Total> {
        if (isActiveFilter) {
            return this.http.post<Total>(`${this.apiUrl}/totals?marketPlace=${marketPlace}`, filter);
        } else {
            return this.http.get<Total>(`${this.apiUrl}/totals?marketPlace=${marketPlace}`);
        }
    }

    public get(page: number, filter: OrderFilter, isActiveFilter: boolean, marketPlace: number): Observable<Order[]> {
        if (isActiveFilter) {
            return this.http.post<Order[]>(`${this.apiUrl}?page=${page}&marketPlace=${marketPlace}`, filter);
        } else {
            return this.http.get<Order[]>(`${this.apiUrl}?page=${page}&marketPlace=${marketPlace}`);
        }
    }
    
    public getbyId(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }
}