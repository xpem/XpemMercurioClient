import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MercadoLivreOath } from "../../models/MercadoLivre/mercado-livre-oath.model";

@Injectable({
    providedIn: "root",
})

export class MercadoLivreService {

    private apiUrl = "/api/MercadoLivre";

    constructor(private http: HttpClient) { }

    public getAuthUri(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Auth/Link`, { responseType: 'text' });
    }

    public postUserCredential(mercadoLivreOath: MercadoLivreOath): Observable<any> {
        return this.http.post(`${this.apiUrl}/Auth/Credential`, mercadoLivreOath, { responseType: 'text' });
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
        return this.http.get(`${this.apiUrl}/Order/Import/ByPeriod?startDate=${startDate}&endDate=${endDate}`);
    }

    public importSingleProduct(productId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Product/Import/${productId}`);
    }
}