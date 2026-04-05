import { Observable } from "rxjs";
import { Company } from "../models/company/company.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CompanyInvoiceSequence } from "../models/company/company-invoice-sequence.model";

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

    public uploadCertificate(file: File, password: string): Observable<any> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("password", password);
        return this.http.post(`${this.apiUrl}/certificate`, formData, { responseType: 'text' });
    }

    public getCompanyTaxInfo(): Observable<CompanyInvoiceSequence> {
        return this.http.get<CompanyInvoiceSequence>(`${this.apiUrl}/invoiceSequence`);
    }

    public saveCompanyTaxInfo(taxInfo: CompanyInvoiceSequence): Observable<string> {
        return this.http.post(`${this.apiUrl}/invoiceSequence`, taxInfo, { responseType: 'text' });
    }
}