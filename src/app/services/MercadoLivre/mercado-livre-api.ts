import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})

export class MercadoLivreService {

    private apiUrl = "/api/MercadoLivre";

    constructor(private http: HttpClient) { }

    public getAuthUri(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Auth/Link`, { responseType: 'text' });
    }
}