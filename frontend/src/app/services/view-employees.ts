import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ViewEmployeesService {

  api = "http://localhost:8082/api/employee";

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GET EMPLOYEES
  // =====================================================

  getEmployees(
    page: number,
    limit: number,
    search: string,
    department: string,
    role: string,
    designation: string,
    sortBy: string = 'name',
    sortOrder: string = 'asc'
  ) {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: token || ""
      });


    return this.http.get(

      `${this.api}?page=${page}` +
      `&limit=${limit}` +
      `&search=${encodeURIComponent(search)}` +
      `&department=${encodeURIComponent(department)}` +
      `&role=${encodeURIComponent(role)}` +
      `&designation=${encodeURIComponent(designation)}` +
      `&sortBy=${sortBy}` +
      `&sortOrder=${sortOrder}`,

      { headers }

    );

  }


  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  deleteEmployee(id: string) {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: token || ""
      });


    return this.http.delete(

      `${this.api}/${id}`,

      { headers }

    );

  }


  // =====================================================
  // DEACTIVATE EMPLOYEE
  // =====================================================

  deactivateEmployee(id: string) {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: token || ""
      });


    return this.http.put(

      `${this.api}/deactivate/${id}`,

      {},

      { headers }

    );

  }


  // =====================================================
  // ACTIVATE EMPLOYEE
  // =====================================================

  activateEmployee(id: string) {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: token || ""
      });


    return this.http.put(

      `${this.api}/activate/${id}`,

      {},

      { headers }

    );

  }
  getInactiveEmployees(
  page: number,
  limit: number,
  search: string,
  department: string,
  role: string,
  designation: string,
  sortBy: string = 'name',
  sortOrder: string = 'asc'
) {

  const token =
    localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: token || ''
  });

  return this.http.get(
    `${this.api}/inactive` +
    `?page=${page}` +
    `&limit=${limit}` +
    `&search=${encodeURIComponent(search)}` +
    `&department=${encodeURIComponent(department)}` +
    `&role=${encodeURIComponent(role)}` +
    `&designation=${encodeURIComponent(designation)}` +
    `&sortBy=${sortBy}` +
    `&sortOrder=${sortOrder}`,
    { headers }
  );

}
}