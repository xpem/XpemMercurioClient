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

    public getTotalOrders(filter: OrderFilter, marketPlace: number | null): Observable<Total> {

        filter.marketplace = marketPlace;

        return this.http.post<Total>(`${this.apiUrl}/totals`, filter);
    }

    public get(page: number, filter: OrderFilter, marketPlace: number | null): Observable<Order[]> {
        filter.marketplace = marketPlace;

        return this.http.post<Order[]>(`${this.apiUrl}?page=${page}`, filter);
    }

    public getbyId(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }
}