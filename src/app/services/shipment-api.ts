import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Order } from "../models/Order/order.model";
import { ShipmentGroupedTotalsRes } from "../models/shipment/shipment.totals.model";

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
    public getOrdersWithPendingLabels(marketplace: number | null, pageFunction: number): Observable<Order[]> {
        const params: Record<string, string> = {
            mode: pageFunction.toString(),
        };

        if (marketplace !== null) {
            params['marketplace'] = marketplace.toString();
        }

        return this.http.get<Order[]>(`${this.apiUrl}/Orders/Pending/PrintLabels`, {
            params
        });
    }

    public getGroupedTotalsPendingShipmentsToPrintLabels(marketplace: number | null): Observable<ShipmentGroupedTotalsRes> {
        const params: Record<string, string> = {};

        if (marketplace !== null) {
            params['marketplace'] = marketplace.toString();
        }

        return this.http.get<ShipmentGroupedTotalsRes>(`${this.apiUrl}/Total/GroupedPending`, {
            params
        });
    }
}