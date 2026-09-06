import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  api = "http://localhost:8082/api/employee";
  constructor(private http: HttpClient) {}
  getProfile(username: string) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: token || ""
    });

    return this.http.get(
      `${this.api}/profile/${username}`,
      { headers }
    );
  }

}