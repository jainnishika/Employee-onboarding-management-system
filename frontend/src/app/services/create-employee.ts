import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CreateEmployeeService {
  api = "http://localhost:8082/api/employee";

  constructor(private http: HttpClient) { }

  createEmployee(data: FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || "" });

    return this.http.post(this.api, data, { headers });
  }

  
}
