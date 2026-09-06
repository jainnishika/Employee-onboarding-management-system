import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditEmployeeService {

  api = "http://localhost:8082/api/edit-employee";

  constructor(private http: HttpClient) {}

  getEmployee(id: string) {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token || ""
    });

    return this.http.get(`${this.api}/${id}`, { headers });
  }

  updateEmployee(
    id: string,
    data: FormData
) {

    const token =
        localStorage.getItem("token") || "";

    return this.http.put(

        `${this.api}/${id}`,

        data,

        {
            headers: {
                Authorization: token
            }
        }

    );

}

}