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

    public markAsRead(ids: number[] | null = null): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/markAsRead`, ids);
    }

    public markAllAsRead(ids: number[] | null = null): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/markAllAsRead`, ids);
    }

    public getAll(page: number = 1): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(`${this.apiUrl}/all?page=${page}`);
    }

    public getAllTotal(): Observable<{ totalItems: number; totalPages: number }> {
        return this.http.get<{ totalItems: number; totalPages: number }>(`${this.apiUrl}/all/total`);
    }
}

