import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SignupService {

  api = "http://localhost:8082/api/signup";

  constructor(private http: HttpClient) { }

  signup(data:any){

    return this.http.post(this.api,data);

  }

}