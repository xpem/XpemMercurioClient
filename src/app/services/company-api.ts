import { Observable } from "rxjs";
import { Company } from "../models/company/company.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})

export class CompanyService {
    private apiUrl = "/api/Company";

    constructor(private http: HttpClient) { }

    public saveCompany(company: Company, isCreate: boolean): Observable<Company> {
        if (isCreate) {
            return this.http.post<Company>(this.apiUrl, company);
        } else {
            return this.http.put<Company>(this.apiUrl, company);
        }
    }

    public getCompany(): Observable<Company> {
        return this.http.get<Company>(this.apiUrl);
    }
}