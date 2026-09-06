import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  api= "http://localhost:8082/api/auth";

  loginApi = "http://localhost:8082/api/auth/login";
  updatePasswordApi = "http://localhost:8082/api/auth/update-password";
  verifyUserApi = "http://localhost:8082/api/auth/verify-user";
  resetPasswordApi = "http://localhost:8082/api/auth/reset-password";

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(this.loginApi, data);
  }

  updatePassword(data: any) {
    return this.http.post(this.updatePasswordApi, data);
  }
  verifyUser(data:any){

  return this.http.post(
    this.api + "/verify-user",
    data
  );

}

resetPassword(data:any){

  return this.http.post(
    this.api + "/reset-password",
    data
  );

}

}