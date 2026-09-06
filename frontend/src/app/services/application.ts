import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private api = "http://localhost:8082/api/application";

  constructor(private http: HttpClient) {}

  submitApplication(application: any) {

    return this.http.post(

      `${this.api}/submit`,

      application,

      {

        headers: {

          Authorization: localStorage.getItem("token") || ""

        }

      }

    );

  }
  getMyApplications(
    page: number,
    limit: number,
    search: string,
    status: string,
    sortBy: string = 'submittedAt',
    sortOrder: string = 'desc'
) {

    return this.http.get(

        `${this.api}/my`,

        {

            params: {

                page: page.toString(),

                limit: limit.toString(),

                search: search,

                status: status,

                sortBy: sortBy,

                sortOrder: sortOrder

            },

            headers: {

                Authorization:
                    localStorage.getItem(
                        'token'
                    ) || ""

            }

        }

    );

}
getAllApplications(
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

    `&sortBy=${sortBy}` +

    `&sortOrder=${sortOrder}`,

    {
      headers: {
        Authorization:
          localStorage.getItem("token") || ""
      }
    }

  );

}
approveApplication(id: string, remarks: string) {

  return this.http.put(

    `${this.api}/approve/${id}`,

    { remarks },

    {
      headers: {
        Authorization: localStorage.getItem("token") || ""
      }
    }

  );

}

rejectApplication(id: string, remarks: string) {

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

}