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

    public postCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, company);
    }   
}