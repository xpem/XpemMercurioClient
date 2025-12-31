import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})

export class NotificationApi {
    private apiUrl = "/api/Notification";

    constructor(private http: HttpClient) { }

    public getTotalUnread(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/notRead/total`);
    }

    public getTopUnread(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/notRead/top`);
    }
}

