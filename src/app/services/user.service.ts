import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  //proxyConfig
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) { }

  getUserToken(userCredentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/session`, userCredentials);
  }
}