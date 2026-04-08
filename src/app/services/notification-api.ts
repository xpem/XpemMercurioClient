import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppNotification } from "../models/appNotification.model";

@Injectable({
    providedIn: "root",
})

export class NotificationApi {
    private apiUrl = "/api/Notification";

    constructor(private http: HttpClient) { }

    public getTotalUnread(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/notRead/total`);
    }

    public getTopUnread(page: number = 0): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(`${this.apiUrl}/notRead/top?page=${page}`);
    }

    public markAsRead(ids: number[]): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/markAsRead`, ids);
    }
}

