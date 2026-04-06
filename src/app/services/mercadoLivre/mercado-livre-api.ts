import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { MercadoLivreOAuth } from "../../models/marketplace/mercado-livre-oauth.model";

@Injectable({
    providedIn: "root",
})

export class MercadoLivreService {

    private apiUrl = "/api/MercadoLivre";

    constructor(private http: HttpClient) { }

    public getAuthUri(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Auth/Link`, { responseType: 'text' });
    }

    public inactivateCredential(credentialId : string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Auth/Credential/${credentialId}`, { responseType: 'text' });
    }

    public postUserCredential(mercadoLivreOAuth: MercadoLivreOAuth): Observable<any> {
        return this.http.post(`${this.apiUrl}/Auth/Credential`, mercadoLivreOAuth, { responseType: 'text' }).pipe(
            timeout(12000)
        );
    }

    public importSingleOrder(orderId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Order/Import/${orderId}`);
    }

    public printShipmentLabel(shipmentId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Order/Shipment/PrintLabel/Unique/${shipmentId}`, { responseType: 'blob' });
    }

    public printShipmentLabels(shipmentId: string[]): Observable<any> {
        return this.http.get(`${this.apiUrl}/Order/Shipment/PrintLabel/List?shipmentIds=${shipmentId.join(',')}`, { responseType: 'blob' });
    }

    public importOrdersByPeriod(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Order/Import/ByPeriod?startDate=${startDate}&endDate=${endDate}`, { responseType: 'text' });
    }

    public importSingleProduct(productId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Product/Import/${productId}`);
    }

    public importAllProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Product/Import`, { responseType: 'text' });
    }
}