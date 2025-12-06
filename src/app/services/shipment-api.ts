import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})

export class ShipmentService {
    private apiUrl = "/api/Shipment";

    constructor(private http: HttpClient) { }

    public getPendingLabelsPrintCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/Total/Pending/PrintLabels`);
    }
}