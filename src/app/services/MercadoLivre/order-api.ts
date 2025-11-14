import { HttpClient } from "@angular/common/http";
import { TotalOrders } from "../../models/Order/totalOrders.model";
import { Observable } from "rxjs";
import { Order } from "../../models/Order/order.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})


export class OrderService {
    private apiUrl = "/api/Order";

    constructor(private http: HttpClient) { }

    public getTotalOrders(): Observable<TotalOrders> {
        return this.http.get<TotalOrders>(`${this.apiUrl}/Total`);
    }

    public get(page: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}?page=${page}`);
    }
}