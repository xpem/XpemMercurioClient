import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Order } from "../models/order/order.model";

@Injectable({
    providedIn: "root",
})

export class ShipmentService {
    private apiUrl = "/api/Shipment";

    constructor(private http: HttpClient) { }

    public getPendingLabelsPrintCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/Total/Pending/PrintLabels`);
    }

    /*get the last 40 orders with pending labels to print*/
    public getOrdersWithPendingLabels(marketplace: number | null): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/Orders/Pending/PrintLabels`, {
            params: {
                marketplace: marketplace !== null ? marketplace.toString() : ''
            }
        });
    }
}