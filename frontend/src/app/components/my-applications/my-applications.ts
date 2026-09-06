import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplications implements OnInit {

  applications: any[] = [];

  selectedApplication: any = null;

  showPopup = false;


  // =========================
  // SEARCH
  // =========================

  searchText = "";


  // =========================
  // STATUS FILTER
  // =========================

  statusFilter = "All";
  currentPage = 1;
  totalPages = 1;
  selectedCount = 10;
  pageNumbers: number[] = [];


  // =========================
  // SORTING
  // =========================

  sortBy = "submittedAt";

  sortOrder = "desc";


  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadApplications();

  }


  // =========================
  // LOAD APPLICATIONS
  // =========================

  loadApplications(): void {

    console.log("Loading my applications...");

    console.log({
      page: this.currentPage,
      limit: this.selectedCount,
      search: this.searchText,
      status: this.statusFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });


    this.applicationService
      .getMyApplications(
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
            "MY APPLICATIONS RESPONSE:",
            res
          );


          this.applications =
            res.applications || [];


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
            "MY APPLICATIONS ERROR:",
            err
          );

          this.applications = [];

        }

      });

  }


  // =========================
  // SEARCH
  // =========================

  searchApplications(): void {

    this.currentPage = 1;

    this.loadApplications();

  }


  // =========================
  // STATUS FILTER
  // =========================

  filterByStatus(): void {

    this.currentPage = 1;

    this.loadApplications();

  }


  // =========================
  // SORTING
  // =========================

  sortColumn(column: string): void {

    if (this.sortBy === column) {

      this.sortOrder =
        this.sortOrder === "asc"
          ? "desc"
          : "asc";

    }

    else {

      this.sortBy = column;

      // Date starts newest first
      if (column === "submittedAt") {

        this.sortOrder = "desc";

      }

      else {

        this.sortOrder = "asc";

      }

    }


    this.currentPage = 1;

    this.loadApplications();

  }


  // =========================
  // SORT ARROW
  // =========================

  getSortArrow(column: string): string {

    if (this.sortBy !== column) {

      return "↕";

    }


    return this.sortOrder === "asc"
      ? "↑"
      : "↓";

  }


  // =========================
  // RECORDS PER PAGE
  // =========================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadApplications();

  }


  // =========================
  // VIEW APPLICATION
  // =========================

  viewApplication(application: any): void {

    this.selectedApplication =
      application;

    this.showPopup = true;

  }


  // =========================
  // CLOSE POPUP
  // =========================

  closePopup(): void {

    this.showPopup = false;

    this.selectedApplication = null;

  }


  // =========================
  // PAGINATION
  // =========================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadApplications();

    }

  }


  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.loadApplications();

    }

  }


  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.loadApplications();

    }

  }


  // =========================
  // TRACK BY
  // =========================

  trackByApplication(
    index: number,
    application: any
  ): any {

    return application?._id || index;

  }

}