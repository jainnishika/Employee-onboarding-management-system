import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class EmployeeDetailsService {
  api = "http://localhost:8082/api/employee-details";
  constructor(private http: HttpClient) {}
  getEmployeeDetails(id: string) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
   Authorization: token || ""
    });

    return this.http.get(
      `${this.api}/${id}`,
      { headers }
    );
  }
}