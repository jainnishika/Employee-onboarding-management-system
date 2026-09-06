import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRequestService } from '../../services/employee-request';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-profile-requests',
  standalone: true,
  imports: [
    CommonModule,FormsModule
  ],
  templateUrl: './my-profile-requests.html',
  styleUrl: './my-profile-requests.css'
})
export class MyProfileRequests implements OnInit {

  requests: any[] = [];
  // =========================
  // PAGINATION
  // =========================
  currentPage = 1;
  totalPages = 1;
  selectedCount = 10;
  pageNumbers: number[] = [];
  sortBy = 'submittedAt';
  sortOrder = 'desc';
  statusFilter = 'All';
  documentFields = [
  {
    key: 'profilePhoto',
    label: 'Profile Photo'
  },
  {
    key: 'aadhaar',
    label: 'Aadhaar'
  },
  {
    key: 'pan',
    label: 'PAN'
  },
  {
    key: 'resume',
    label: 'Resume'
  },
  {
    key: 'licence',
    label: 'Driving Licence'
  },
  {
    key: 'rc',
    label: 'RC'
  },
  {
    key: 'vehicle',
    label: 'Vehicle Document'
  }
];
  // =========================
  // POPUP
  // =========================
  showPopup = false;
  selectedRequest: any = null;

  constructor(
    private employeeRequestService:
      EmployeeRequestService,
    private cdRef: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadRequests();
  }

  // =========================
  // LOAD REQUESTS
  // =========================
  loadRequests(): void {

    this.employeeRequestService
      .getMyRequests(
        this.currentPage,
        this.selectedCount,
        this.sortBy,
        this.sortOrder,
        this.statusFilter
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'MY PROFILE REQUESTS:',
            res
          );

          this.requests =
            res.requests || [];

          this.currentPage =
            res.currentPage || 1;

          this.totalPages =
            res.totalPages || 1;
            this.cdRef.detectChanges();


          // Generate page numbers

          this.pageNumbers =
            Array.from(
              {
                length: this.totalPages
              },
              (_, i) => i + 1
            );

        },

        error: (err) => {

          console.log(
            'MY REQUESTS ERROR:',
            err
          );

          this.requests = [];

        }

      });

  }

  filterByStatus(): void {

    this.currentPage = 1;

    this.loadRequests();

}


  // =========================
  // SORT COLUMN
  // =========================

  sortColumn(column: string): void {

    if (this.sortBy === column) {

      this.sortOrder =
        this.sortOrder === 'asc'
          ? 'desc'
          : 'asc';

    }
    else {

      this.sortBy = column;

      // Date starts newest first

      if (column === 'submittedAt') {

        this.sortOrder = 'desc';

      }
      else {

        this.sortOrder = 'asc';

      }

    }


    this.currentPage = 1;

    this.loadRequests();

  }
  hasNewDocuments(request: any): boolean {

  if (!request) {
    return false;
  }

  return this.documentFields.some(
    document =>
      this.isDocumentChanged(
        request,
        document.key
      )
  );

}
getDocumentUrl(
    filename: string,
    documentName?: string
): string {

    if (!filename) {
        return '';
    }

    // If database already contains a complete path
    if (filename.includes('/')) {
        return `http://localhost:8082/${filename}`;
    }

    const folders: any = {

        profilePhoto: 'profile',

        aadhaar: 'aadhaar',

        pan: 'pan',

        resume: 'resume',

        licence: 'licence',

        rc: 'rc',

        vehicle: 'vehicle'

    };

    const folder =
        folders[documentName || ''];

    if (!folder) {
        return '';
    }

    return `http://localhost:8082/uploads/${folder}/${filename}`;
}

  // =========================
  // GET SORT ARROW
  // =========================

  getSortArrow(column: string): string {

    if (this.sortBy !== column) {

      return '↕';

    }

    return this.sortOrder === 'asc'
      ? '↑'
      : '↓';

  }


  // =========================
  // CHANGE RECORDS
  // =========================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadRequests();

  }


  // =========================
  // NEXT PAGE
  // =========================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.loadRequests();

    }

  }


  // =========================
  // PREVIOUS PAGE
  // =========================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.loadRequests();

    }

  }


  // =========================
  // GO TO PAGE
  // =========================

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.loadRequests();

    }

  }


  // =========================
  // VIEW CHANGES
  // =========================

  viewChanges(request: any): void {
    console.log(
    "FULL PROFILE REQUEST:",
    request
  );

  console.log(
    "OLD DOCUMENTS:",
    request.oldData?.documents
  );

  console.log(
    "REQUESTED DOCUMENTS:",
    request.requestedData?.documents
  );


    this.selectedRequest =
      request;

    this.showPopup = true;

  }


  // =========================
  // CLOSE POPUP
  // =========================

  closePopup(): void {

    this.showPopup = false;

    this.selectedRequest = null;

  }


  // =========================
  // BASIC FIELD CHANGE
  // =========================

  isChanged(
  request: any,
  field: string
): boolean {

  if (!request) {
    return false;
  }

  const oldValue =
    request.oldData?.[field];

  const newValue =
    request.requestedData?.[field];

  // If the requested value doesn't exist,
  // don't highlight the field.
  if (
    newValue === undefined ||
    newValue === null
  ) {
    return false;
  }

  return this.normalizeValue(oldValue) !==
         this.normalizeValue(newValue);
}

  // =========================
  // ADDITIONAL DETAIL CHANGE
  // =========================

  isAdditionalChanged(
  request: any,
  field: string
): boolean {

  if (!request) {
    return false;
  }

  const oldValue =
    request
      .oldData
      ?.additionalDetails
      ?.[field];

  const newValue =
    request
      .requestedData
      ?.additionalDetails
      ?.[field];

  if (
    newValue === undefined ||
    newValue === null
  ) {
    return false;
  }

  return this.normalizeValue(oldValue) !==
         this.normalizeValue(newValue);
}
isDocumentChanged(
  request: any,
  documentName: string
): boolean {

  if (!request) {
    return false;
  }

  const oldDocument =
    request
      .oldData
      ?.documents
      ?.[documentName];

  const newDocument =
    request
      .requestedData
      ?.documents
      ?.[documentName];

  // No new document
  if (
    !newDocument ||
    newDocument === ''
  ) {
    return false;
  }

  return this.normalizeValue(oldDocument) !==
         this.normalizeValue(newDocument);
}
getNewDocument(
  request: any,
  documentName: string
): string {

  return (
    request
      ?.requestedData
      ?.documents
      ?.[documentName]
    || ''
  );

}


  // =========================
  // NORMALIZE VALUE
  // =========================

  normalizeValue(value: any): string {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '';
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value
      .toISOString()
      .split('T')[0];
  }

  // Handle date strings
  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(value)
  ) {
    return value.split('T')[0];
  }

  return String(value).trim();
}

  // =========================
  // FORMAT VALUE
  // =========================

  displayValue(value: any): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {

      return '-';

    }

    return String(value);

  }


  // =========================
  // FORMAT DATE
  // =========================

  formatDate(value: any): string {

    if (!value) {

      return '-';

    }

    return new Date(value)
      .toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
      );

  }


  // =========================
  // SERVICE CHANGES
  // =========================

  serviceChanged(
    oldService: any,
    newService: any,
    field: string
  ): boolean {

    const oldValue =
      oldService?.[field];

    const newValue =
      newService?.[field];


    return this.normalizeValue(
      oldValue
    ) !==
    this.normalizeValue(
      newValue
    );

  }


  // =========================
  // GET OLD SERVICE
  // =========================

  getOldService(
    index: number
  ): any {

    return this.selectedRequest
      ?.oldData
      ?.additionalDetails
      ?.previousServices
      ?.[index];

  }


  // =========================
  // GET NEW SERVICE
  // =========================

  getNewService(
    index: number
  ): any {

    return this.selectedRequest
      ?.requestedData
      ?.additionalDetails
      ?.previousServices
      ?.[index];

  }


  // =========================
  // SERVICE COUNT
  // =========================

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


  // =========================
  // TRACK BY
  // =========================

  trackByRequest(
    index: number,
    request: any
  ): any {

    return request?._id || index;

  }

}