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

    public getTotalOrders(isActiveFilter: boolean, filter: OrderFilter): Observable<Total> {
        if (isActiveFilter) {
            return this.http.post<Total>(`${this.apiUrl}/totals`, filter);
        } else {
            return this.http.get<Total>(`${this.apiUrl}/totals`);
        }
    }

    public get(page: number, filter: OrderFilter, isActiveFilter: boolean): Observable<Order[]> {
        if (isActiveFilter) {
            return this.http.post<Order[]>(`${this.apiUrl}?page=${page}`, filter);
        } else {
            return this.http.get<Order[]>(`${this.apiUrl}?page=${page}`);
        }
    }
    public getbyId(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }
}