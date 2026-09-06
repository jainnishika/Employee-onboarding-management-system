import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRequestService {

  private api = 'http://localhost:8082/api/request';

  constructor(private http: HttpClient) {}

  submitRequest(employee: any) {

    return this.http.post(
      `${this.api}/submit`,
      { employee },
      {
        headers: {
          Authorization: localStorage.getItem("token") || ""
        }
      }
    );

  }


  getAllRequests(
  page: number,
  limit: number,
  search: string,
  status: string,
  sortBy: string = "submittedAt",
  sortOrder: string = "desc"
) {

  return this.http.get(

    `${this.api}/all` +

    `?page=${page}` +

    `&limit=${limit}` +

    `&search=${encodeURIComponent(search)}` +

    `&status=${encodeURIComponent(status)}` +

    `&sortBy=${encodeURIComponent(sortBy)}` +

    `&sortOrder=${encodeURIComponent(sortOrder)}`,

    {
      headers: {
        Authorization:
          localStorage.getItem("token") || ""
      }
    }

  );
}

getMyRequests(
    page: number,
    limit: number,
    sortBy: string = 'submittedAt',
    sortOrder: string = 'desc',
    status: string = 'All'
) {

    return this.http.get(

        `${this.api}/my-requests`,

        {
            params: {
                page: page.toString(),
                limit: limit.toString(),
                sortBy: sortBy,
                sortOrder: sortOrder,
                 status: status
            },

            headers: {
                Authorization:
                    localStorage.getItem('token') || ''
            }
        }

    );

}

  approveRequest(id: string) {
    return this.http.put(
      `${this.api}/approve/${id}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token") || ""
        }
      }
    );

  }


  rejectRequest(id: string, remarks: string) {

    return this.http.put(
      `${this.api}/reject/${id}`,
      { remarks },
      {
        headers: {
          Authorization: localStorage.getItem("token") || ""
        }
      }
    );

  }


  getStatus(username: string) {

    return this.http.get(
      `${this.api}/status/${username}`,
      {
        headers: {
          Authorization: localStorage.getItem("token") || ""
        }
      }
    );

  }

}