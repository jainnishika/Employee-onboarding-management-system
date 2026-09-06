import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-application-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './application-requests.html',
  styleUrl: './application-requests.css'
})
export class ApplicationRequests implements OnInit {

  // =====================================================
  // APPLICATION DATA
  // =====================================================

  applications: any[] = [];

  filteredApplications: any[] = [];

  displayedApplications: any[] = [];


  // =====================================================
  // SORTING
  // =====================================================

  sortBy = "submittedAt";

  sortOrder = "desc";

  employeeSortOrder = "asc";

  dateSortOrder = "desc";


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchText = "";

  statusFilter = "All";


  // =====================================================
  // RECORDS / PAGINATION
  // =====================================================

  selectedCount = 10;

  currentPage = 1;

  totalPages = 1;

  pageNumbers: number[] = [];


  // =====================================================
  // POPUP
  // =====================================================

  remarks = "";

  showPopup = false;

  selectedApplication: any = null;


  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadApplications();

  }


  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  loadApplications(): void {

    console.log("Loading applications...");

    console.log({
      page: this.currentPage,
      limit: this.selectedCount,
      search: this.searchText,
      status: this.statusFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });


    this.applicationService
      .getAllApplications(
        this.currentPage,
        this.selectedCount,
        this.searchText,
        this.statusFilter,
        this.sortBy,
        this.sortOrder
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            "APPLICATION SERVER RESPONSE:",
            res
          );


          this.applications =
            res.applications || [];


          this.filteredApplications =
            this.applications;


          this.displayedApplications =
            this.applications;


          this.currentPage =
            res.currentPage || 1;


          this.totalPages =
            res.totalPages || 1;


          this.pageNumbers =
            Array.from(
              {
                length: this.totalPages
              },
              (_, i) => i + 1
            );


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.log(
            "APPLICATION API ERROR:",
            err
          );

          this.applications = [];

          this.filteredApplications = [];

          this.displayedApplications = [];

        }

      });

  }


  // =====================================================
  // SORT COLUMN
  // =====================================================

  sortColumn(column: string): void {

    // -----------------------------------------
    // EMPLOYEE
    // -----------------------------------------

    if (column === "username") {

      if (this.sortBy === "username") {

        this.employeeSortOrder =
          this.employeeSortOrder === "asc"
            ? "desc"
            : "asc";

      }
      else {

        this.employeeSortOrder = "asc";

      }


      this.sortBy = "username";

      this.sortOrder =
        this.employeeSortOrder;

    }


    // -----------------------------------------
    // SUBMITTED DATE
    // -----------------------------------------

    else if (column === "submittedAt") {

      if (this.sortBy === "submittedAt") {

        this.dateSortOrder =
          this.dateSortOrder === "asc"
            ? "desc"
            : "asc";

      }
      else {

        this.dateSortOrder = "desc";

      }


      this.sortBy = "submittedAt";

      this.sortOrder =
        this.dateSortOrder;

    }


    this.currentPage = 1;

    this.loadApplications();

  }


  // =====================================================
  // SORT ARROW
  // =====================================================

  getSortArrow(column: string): string {

    if (this.sortBy !== column) {

      return "unfold_more";

    }


    return this.sortOrder === "asc"
      ? "arrow_upward"
      : "arrow_downward";

  }
  exportToExcel(): void {

  console.log(

    "Applications available for Excel:",

    this.applications

  );

  if (

    !this.applications ||

    this.applications.length === 0

  ) {

    alert("No application data available to export.");

    return;

  }

  // =========================================

  // EXCEL HEADERS

  // =========================================

  const headers = [

    "Employee",

    "Application Type",

    "Status",

    "Submitted Date",

    "Leave Type",

    "From Date",

    "To Date",

    "Last Working Day",

    "Amount",

    "Reason",

    "Remarks",

    "Reviewed By",

    "Reviewed On"

  ];

  // =========================================

  // EXCEL ROWS

  // =========================================

  const rows = this.applications.map(

    (app: any) => {

      const data =

        app.applicationData || {};

      return [

        app.username || "",

        app.applicationType || "",

        app.status || "",

        app.submittedAt

          ? new Date(

              app.submittedAt

            ).toLocaleDateString()

          : "",

        data.leaveType || "",

        data.fromDate

          ? new Date(

              data.fromDate

            ).toLocaleDateString()

          : "",

        data.toDate

          ? new Date(

              data.toDate

            ).toLocaleDateString()

          : "",

        data.lastWorkingDay

          ? new Date(

              data.lastWorkingDay

            ).toLocaleDateString()

          : "",

        data.amount || "",

        data.reason || "",

        app.remarks || "",

        app.reviewedBy || "",

        app.reviewedAt

          ? new Date(

              app.reviewedAt

            ).toLocaleString()

          : ""

      ];

    }

  );

  console.log(

    "Excel Headers:",

    headers

  );

  console.log(

    "Excel Rows:",

    rows

  );

  // =========================================

  // CREATE SHEET

  // =========================================

  const worksheet =

    XLSX.utils.aoa_to_sheet([

      headers,

      ...rows

    ]);

  // =========================================

  // COLUMN WIDTHS

  // =========================================

  worksheet["!cols"] = [

    { wch: 18 }, // Employee

    { wch: 22 }, // Application Type

    { wch: 14 }, // Status

    { wch: 18 }, // Submitted Date

    { wch: 15 }, // Leave Type

    { wch: 15 }, // From Date

    { wch: 15 }, // To Date

    { wch: 20 }, // Last Working Day

    { wch: 12 }, // Amount

    { wch: 35 }, // Reason

    { wch: 35 }, // Remarks

    { wch: 20 }, // Reviewed By

    { wch: 22 }  // Reviewed On

  ];

  // =========================================

  // CREATE WORKBOOK

  // =========================================

  const workbook =

    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Applications"

  );

  // =========================================

  // DOWNLOAD EXCEL

  // =========================================

  XLSX.writeFile(

    workbook,

    `Application_Requests_${new Date().getTime()}.xlsx`
  );
}
  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  filterApplications(): void {

    this.currentPage = 1;

    this.loadApplications();

  }


  // =====================================================
  // VIEW APPLICATION
  // =====================================================

  view(app: any): void {

    this.selectedApplication = app;

    this.remarks =
      app.remarks || "";

    this.showPopup = true;


    console.log(
      "SELECTED APPLICATION:",
      this.selectedApplication
    );


    console.log(
      "APPLICATION DATA:",
      app.applicationData
    );


    console.log(
      "DOCUMENTS:",
      app.documents
    );


    this.cdr.detectChanges();

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(value: any): string {

    if (!value) {

      return "-";

    }


    const date =
      new Date(value);


    if (
      isNaN(
        date.getTime()
      )
    ) {

      return "-";

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  }


  // =====================================================
  // DISPLAY VALUE
  // =====================================================

  displayValue(value: any): string {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "-";

    }


    return String(value);

  }


  // =====================================================
  // GET APPLICATION DATA
  // =====================================================

  getApplicationData(): any {

    return (
      this.selectedApplication
        ?.applicationData || {}
    );

  }


  // =====================================================
  // GET DOCUMENTS
  // =====================================================

  getDocuments(): any {

    return (
      this.selectedApplication
        ?.documents || {}
    );

  }


  // =====================================================
  // DOCUMENT URL
  // =====================================================

  getDocumentUrl(
    fileName: string
  ): string {

    if (!fileName) {

      return "";

    }


    if (
      fileName.startsWith("http://") ||
      fileName.startsWith("https://")
    ) {

      return fileName;

    }


    let cleanFileName =
      String(fileName);


    cleanFileName =
      cleanFileName.replace(
        /^\/+/,
        ""
      );


    cleanFileName =
      cleanFileName.replace(
        /^uploads\//,
        ""
      );


    return (
      "http://localhost:8082/uploads/" +
      cleanFileName
    );

  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.loadApplications();

    }

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.loadApplications();

    }

  }


  // =====================================================
  // GO TO PAGE
  // =====================================================

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.loadApplications();

    }

  }


  // =====================================================
  // RECORDS PER PAGE
  // =====================================================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadApplications();

  }


  // =====================================================
  // APPROVE
  // =====================================================

  approve(): void {

    if (!this.selectedApplication) {

      return;

    }


    this.applicationService
      .approveApplication(
        this.selectedApplication._id,
        this.remarks
      )
      .subscribe({

        next: () => {

          alert(
            "Application Approved Successfully"
          );


          this.closePopup();

          this.loadApplications();

        },


        error: (err) => {

          console.log(
            "Approve Error:",
            err
          );

        }

      });

  }


  // =====================================================
  // REJECT
  // =====================================================

  reject(): void {

    if (!this.selectedApplication) {

      return;

    }


    if (!this.remarks.trim()) {

      alert(
        "Please enter rejection remarks."
      );

      return;

    }


    this.applicationService
      .rejectApplication(
        this.selectedApplication._id,
        this.remarks
      )
      .subscribe({

        next: () => {

          alert(
            "Application Rejected Successfully"
          );


          this.closePopup();

          this.loadApplications();

        },


        error: (err) => {

          console.log(
            "Reject Error:",
            err
          );

        }

      });

  }


  // =====================================================
  // CLOSE POPUP
  // =====================================================

  closePopup(): void {

    this.showPopup = false;

    this.selectedApplication = null;

    this.remarks = "";

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByApplication(
    index: number,
    application: any
  ): any {

    return (
      application?._id ||
      index
    );

  }

}