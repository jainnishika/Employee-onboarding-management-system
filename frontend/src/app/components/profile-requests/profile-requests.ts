import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRequestService } from '../../services/employee-request';
import { ChangeDetectorRef } from '@angular/core';
import { SnackbarService } from '../../services/snackbar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-profile-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './profile-requests.html',
  styleUrl: './profile-requests.css'
})
export class ProfileRequests implements OnInit {

  // =====================================================
  // REQUEST DATA
  // =====================================================

  requests: any[] = [];

  filteredRequests: any[] = [];

  displayedRequests: any[] = [];


  // =====================================================
  // POPUP
  // =====================================================

  selectedRequest: any = null;

  showRejectBox = false;

  remarks = "";


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchText = "";

  selectedStatus = "All";


  // =====================================================
  // PAGINATION
  // =====================================================

  selectedCount = 10;

  currentPage = 1;

  totalPages = 1;

  pageNumbers: number[] = [];


  // =====================================================
  // SORTING
  // =====================================================

  sortBy = "submittedAt";

  sortOrder = "desc";

  employeeSortOrder = "asc";

  dateSortOrder = "desc";


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private employeeRequestService: EmployeeRequestService,
    private cdr: ChangeDetectorRef,
    private snack: SnackbarService,
    private router: Router
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadRequests();

  }


  // =====================================================
  // LOAD REQUESTS
  // =====================================================

  loadRequests(): void {

    console.log("Loading profile requests...");

    this.employeeRequestService
      .getAllRequests(
        this.currentPage,
        this.selectedCount,
        this.searchText,
        this.selectedStatus,
        this.sortBy,
        this.sortOrder
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            "PROFILE REQUEST RESPONSE:",
            res
          );

          this.requests =
            res.requests || [];

          this.filteredRequests =
            this.requests;

          this.displayedRequests =
            this.requests;

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
            "PROFILE REQUEST ERROR:",
            err
          );

          this.requests = [];

          this.filteredRequests = [];

          this.displayedRequests = [];

        }

      });

  }


  // =====================================================
  // SORT COLUMN
  // =====================================================

  sortColumn(column: string): void {

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

    this.loadRequests();

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


  // =====================================================
  // FILTER
  // =====================================================

  filterRequests(): void {

    this.currentPage = 1;

    this.loadRequests();

  }


  // =====================================================
  // CHANGE RECORDS
  // =====================================================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadRequests();

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadRequests();

    }

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

      this.loadRequests();

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

      this.loadRequests();

    }

  }


  // =====================================================
  // VIEW REQUEST
  // =====================================================

  viewRequest(request: any): void {

    this.selectedRequest = request;

    this.showRejectBox = false;

    this.remarks = "";

    console.log(
      "FULL REQUEST:",
      this.selectedRequest
    );

    console.log(
      "OLD DATA:",
      this.selectedRequest?.oldData
    );

    console.log(
      "REQUESTED DATA:",
      this.selectedRequest?.requestedData
    );

    console.log(
      "OLD DOCUMENTS:",
      this.selectedRequest
        ?.oldData
        ?.documents
    );

    console.log(
      "REQUESTED DOCUMENTS:",
      this.selectedRequest
        ?.requestedData
        ?.documents
    );

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE POPUP
  // =====================================================

  closeModal(): void {

    this.selectedRequest = null;

    this.showRejectBox = false;

    this.remarks = "";

  }


  // =====================================================
  // BASIC FIELD CHANGE
  // =====================================================

  isChanged(
    oldValue: any,
    newValue: any
  ): boolean {

    return (
      this.normalizeValue(oldValue) !==
      this.normalizeValue(newValue)
    );

  }


  // =====================================================
  // ADDITIONAL DETAIL CHANGE
  // =====================================================

  isAdditionalChanged(
    request: any,
    field: string
  ): boolean {

    if (!request) {

      return false;

    }

    const oldValue =
      request
        ?.oldData
        ?.additionalDetails
        ?.[field];

    const newValue =
      request
        ?.requestedData
        ?.additionalDetails
        ?.[field];

    return (
      this.normalizeValue(oldValue) !==
      this.normalizeValue(newValue)
    );

  }


  // =====================================================
  // DOCUMENT CHANGE
  // =====================================================

  isDocumentChanged(
    request: any,
    documentName: string
  ): boolean {

    if (!request) {

      return false;

    }

    const oldDocument =
      request
        ?.oldData
        ?.documents
        ?.[documentName];

    const newDocument =
      request
        ?.requestedData
        ?.documents
        ?.[documentName];


    /*
     * No requested document
     */

    if (
      !newDocument ||
      newDocument === ""
    ) {

      return false;

    }


    /*
     * Same file = no change
     */

    if (
      this.normalizeValue(oldDocument) ===
      this.normalizeValue(newDocument)
    ) {

      return false;

    }


    /*
     * Different file = changed/new document
     */

    return true;

  }


  // =====================================================
  // DOCUMENT URL
  // =====================================================

  getDocumentUrl(
    fileName: string,
    documentType: string
  ): string {

    if (!fileName) {

      return "";

    }


    /*
     * Already a complete URL
     */

    if (
      fileName.startsWith("http://") ||
      fileName.startsWith("https://")
    ) {

      return fileName;

    }


    let cleanFileName =
      String(fileName);


    /*
     * Remove leading slash
     */

    cleanFileName =
      cleanFileName.replace(
        /^\/+/,
        ""
      );


    /*
     * Remove uploads/ if already present
     */

    cleanFileName =
      cleanFileName.replace(
        /^uploads\//,
        ""
      );


    const folderMap: any = {

      profilePhoto: "profile",

      aadhaar: "aadhaar",

      pan: "pan",

      resume: "resume",

      licence: "licence",

      rc: "rc",

      vehicle: "vehicle",

      experienceCertificate:
        "experienceCertificate"

    };


    const folder =
      folderMap[documentType];


    if (!folder) {

      return "";

    }


    /*
     * If filename already contains folder
     */

    if (
      cleanFileName.startsWith(
        folder + "/"
      )
    ) {

      return (
        "http://localhost:8082/uploads/" +
        cleanFileName
      );

    }


    return (
      "http://localhost:8082/uploads/" +
      folder +
      "/" +
      cleanFileName
    );

  }


  // =====================================================
  // NORMALIZE VALUE
  // =====================================================

  normalizeValue(value: any): string {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }


    if (
      value instanceof Date
    ) {

      return value
        .toISOString()
        .split("T")[0];

    }


    /*
     * Normalize MongoDB date strings
     */

    if (
      typeof value === "string" &&
      value.includes("T")
    ) {

      const date =
        new Date(value);

      if (
        !isNaN(
          date.getTime()
        )
      ) {

        return date
          .toISOString()
          .split("T")[0];

      }

    }


    return String(value).trim();

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
  // SERVICE CHANGE
  // =====================================================

  serviceChanged(
    oldService: any,
    newService: any,
    field: string
  ): boolean {

    const oldValue =
      oldService?.[field];

    const newValue =
      newService?.[field];

    return (
      this.normalizeValue(oldValue) !==
      this.normalizeValue(newValue)
    );

  }


  // =====================================================
  // OLD SERVICE
  // =====================================================

  getOldService(
    index: number
  ): any {

    return this.selectedRequest
      ?.oldData
      ?.additionalDetails
      ?.previousServices
      ?.[index];

  }


  // =====================================================
  // NEW SERVICE
  // =====================================================

  getNewService(
    index: number
  ): any {

    return this.selectedRequest
      ?.requestedData
      ?.additionalDetails
      ?.previousServices
      ?.[index];

  }


  // =====================================================
  // SERVICE COUNT
  // =====================================================

  getServiceCount(): number {

    const oldServices =
      this.selectedRequest
        ?.oldData
        ?.additionalDetails
        ?.previousServices
        ?.length || 0;

    const newServices =
      this.selectedRequest
        ?.requestedData
        ?.additionalDetails
        ?.previousServices
        ?.length || 0;

    return Math.max(
      oldServices,
      newServices
    );

  }


  // =====================================================
  // APPROVE REQUEST
  // =====================================================

  approveRequest(): void {

    if (!this.selectedRequest) {

      return;

    }

    this.employeeRequestService
      .approveRequest(
        this.selectedRequest._id
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            "APPROVE RESPONSE:",
            res
          );

          this.snack.success(
            res.message
          );

          this.closeModal();

          this.loadRequests();

        },

        error: (err) => {

          console.log(
            "APPROVE ERROR:",
            err
          );

          this.snack.error(
            err.error?.message ||
            "Unable to approve request"
          );

        }

      });

  }
  exportToExcel(): void {

  const excelData = this.filteredRequests.map(
    (request: any) => {

      const oldData = request.oldData || {};
      const newData = request.requestedData || {};

      return {

        "Employee Name":
          newData.name ||
          oldData.name ||
          "-",

        "Username":
          newData.username ||
          oldData.username ||
          "-",

        "Email":
          newData.email ||
          oldData.email ||
          "-",

        "Phone":
          newData.phone ||
          oldData.phone ||
          "-",

        "Department":
          newData.department ||
          oldData.department ||
          "-",

        "Designation":
          newData.designation ||
          oldData.designation ||
          "-",

        "Role":
          newData.role ||
          oldData.role ||
          "-",

        "Request Status":
          request.status || "Pending",

        "Submitted At":
          request.submittedAt
            ? this.formatDate(request.submittedAt)
            : "-"

      };

    }
  );


  // Create worksheet
  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(excelData);


  // Create workbook
  const workbook: XLSX.WorkBook = {

    Sheets: {
      "Profile Update Requests": worksheet
    },

    SheetNames: [
      "Profile Update Requests"
    ]

  };


  // Convert workbook to Excel buffer
  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array"
    }
  );


  // Create Excel file
  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    }
  );


  // Download
  FileSaver.saveAs(
    blob,
    `Profile_Update_Requests_${new Date().getTime()}.xlsx`
  );

}

  // =====================================================
  // OPEN REJECT BOX
  // =====================================================

  openRejectBox(): void {

    this.showRejectBox = true;

    this.remarks = "";

  }


  // =====================================================
  // CANCEL REJECT
  // =====================================================

  cancelReject(): void {

    this.showRejectBox = false;

    this.remarks = "";

  }


  // =====================================================
  // SUBMIT REJECT
  // =====================================================

  submitReject(): void {

    if (!this.remarks.trim()) {

      alert(
        "Please enter rejection remarks."
      );

      return;

    }


    if (!this.selectedRequest) {

      return;

    }


    this.employeeRequestService
      .rejectRequest(
        this.selectedRequest._id,
        this.remarks
      )
      .subscribe({

        next: (res: any) => {

          this.snack.success(
            res.message
          );

          this.showRejectBox = false;

          this.remarks = "";

          this.closeModal();

          this.loadRequests();

        },

        error: (err) => {

          console.log(
            "REJECT ERROR:",
            err
          );

          this.snack.error(
            err.error?.message ||
            "Unable to reject request"
          );

        }

      });

  }


  // =====================================================
  // BACK
  // =====================================================

  back(): void {

    const role =
      localStorage.getItem("role");


    if (role === "Admin") {

      this.router.navigate([
        "/admin-dashboard"
      ]);

    }

    else if (role === "HR") {

      this.router.navigate([
        "/hr-dashboard"
      ]);

    }

    else {

      this.router.navigate([
        "/"
      ]);

    }

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByRequest(
    index: number,
    request: any
  ): any {

    return (
      request?._id ||
      index
    );

  }

}