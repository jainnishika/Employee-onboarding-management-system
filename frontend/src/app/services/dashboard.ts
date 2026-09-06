import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  api = "http://localhost:8082/api/dashboard";
  constructor(private http: HttpClient) {}
  getStats() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: token || ""
    });
    return this.http.get(`${this.api}/stats`, { headers });
  }
  getRecentEmployees(){
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: token || ""
    });
    return this.http.get(
      `${this.api}/recent`,
      {headers}
    ); 
  }

}