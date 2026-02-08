import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timeout } from "rxjs";
import { ShopeeAuth } from "../../models/marketplace/shopee-oauth.model";

@Injectable({
    providedIn: "root",
})

export class ShopeeApiService {

    private apiUrl = "/api/Shopee";

    constructor(private http: HttpClient) { }

    public getAuthUri(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Auth/Link`, { responseType: 'text' });
    }

    public getCancelAuthUri(credencialId: string): Observable<any> {
        console.log('Solicitando URL de cancelamento de autenticação para credencial ID:', credencialId);
        return this.http.get(`${this.apiUrl}/Auth/Link/Cancel/${credencialId}`, { responseType: 'text' });
    }

    public postUserCredential(shopeeAuth: ShopeeAuth): Observable<any> {
        return this.http.post(`${this.apiUrl}/Auth/Credential`, shopeeAuth, { responseType: 'text' }).pipe(
            timeout(12000)
        );
    }

    public importSingleProduct(productId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Product/Import/${productId}`, { responseType: 'text' });
    }

    public importAllProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Product/Import`, { responseType: 'text' });
    }


}

