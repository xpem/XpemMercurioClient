import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})

export class InvoiceService {
    private apiUrl = "/api/Invoice";

    constructor(private http: HttpClient) { }

    public issueNFe(orderId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/issueNFe?orderId=${orderId}`, { responseType: 'text' });
    }
}
