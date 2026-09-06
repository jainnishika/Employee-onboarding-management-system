import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {

  private api = "http://localhost:8082/api/upload";

  constructor(private http: HttpClient) {}

  uploadDocuments(formData: FormData) {

    return this.http.post(

      `${this.api}/documents`,

      formData,

      {

        headers: {

          Authorization: localStorage.getItem("token") || ""

        }

      }

    );

  }

}