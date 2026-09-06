import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ViewEmployeesService } from '../../services/view-employees';
import { SnackbarService } from '../../services/snackbar';

@Component({
  selector: 'app-inactive-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './inactive-employees.html',
  styleUrl: './inactive-employees.css'
})
export class InactiveEmployees implements OnInit {

  // =========================================
  // EMPLOYEES
  // =========================================

  employees: any[] = [];

  filteredEmployees: any[] = [];

  displayedEmployees: any[] = [];


  // =========================================
  // SEARCH
  // =========================================

  searchText = '';


  // =========================================
  // FILTERS
  // =========================================

  selectedDepartment = '';

  selectedRole = '';

  selectedDesignation = '';

  departments: string[] = [];

  roles: string[] = [];

  designations: string[] = [];


  // =========================================
  // PAGINATION
  // =========================================

  selectedCount = 10;

  currentPage = 1;

  totalPages = 1;

  pageNumbers: number[] = [];


  // =========================================
  // SORTING
  // =========================================

  sortBy = 'name';

  sortOrder = 'asc';


  // =========================================
  // ACTIVATE POPUP
  // =========================================

  showActivatePopup = false;

  selectedEmployeeId = '';


  // =========================================
  // USER ROLE
  // =========================================

  role = localStorage.getItem('role');


  constructor(
    private viewEmployeesService: ViewEmployeesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: SnackbarService
  ) {}


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.loadInactiveEmployees();

  }


  // =========================================
  // LOAD INACTIVE EMPLOYEES
  // =========================================

  loadInactiveEmployees(): void {

    this.viewEmployeesService
      .getInactiveEmployees(
        this.currentPage,
        this.selectedCount,
        this.searchText,
        this.selectedDepartment,
        this.selectedRole,
        this.selectedDesignation,
        this.sortBy,
        this.sortOrder
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'INACTIVE EMPLOYEES:',
            res
          );


          this.employees =
            res.employees || [];


          this.filteredEmployees =
            this.employees;


          this.displayedEmployees =
            this.employees;


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


          /*
           * Filter dropdown values
           */

          this.departments = [
            ...new Set(
              this.employees
                .map(
                  (e: any) =>
                    e.department
                )
                .filter(Boolean)
            )
          ];


          this.roles = [
            ...new Set(
              this.employees
                .map(
                  (e: any) =>
                    e.role
                )
                .filter(Boolean)
            )
          ];


          this.designations = [
            ...new Set(
              this.employees
                .map(
                  (e: any) =>
                    e.designation
                )
                .filter(Boolean)
            )
          ];


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.log(
            'INACTIVE EMPLOYEES ERROR:',
            err
          );

          this.employees = [];

          this.filteredEmployees = [];

          this.displayedEmployees = [];

          this.snack.error(
            err.error?.message ||
            'Unable to load deactivated employees'
          );

        }

      });

  }


  // =========================================
  // SEARCH
  // =========================================

  searchEmployees(): void {

    this.currentPage = 1;

    this.loadInactiveEmployees();

  }


  // =========================================
  // FILTERS
  // =========================================

  applyFilters(): void {

    this.currentPage = 1;

    this.loadInactiveEmployees();

  }


  // =========================================
  // SORT
  // =========================================

  sortColumn(column: string): void {

    if (this.sortBy === column) {

      this.sortOrder =
        this.sortOrder === 'asc'
          ? 'desc'
          : 'asc';

    }

    else {

      this.sortBy = column;

      this.sortOrder = 'asc';

    }


    this.currentPage = 1;

    this.loadInactiveEmployees();

  }


  // =========================================
  // SORT ARROW
  // =========================================

  getSortArrow(column: string): string {

    if (this.sortBy !== column) {

      return '↕';

    }

    return this.sortOrder === 'asc'
      ? '↑'
      : '↓';

  }


  // =========================================
  // CHANGE RECORDS
  // =========================================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadInactiveEmployees();

  }


  // =========================================
  // PREVIOUS PAGE
  // =========================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadInactiveEmployees();

    }

  }


  // =========================================
  // NEXT PAGE
  // =========================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.loadInactiveEmployees();

    }

  }


  // =========================================
  // GO TO PAGE
  // =========================================

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.loadInactiveEmployees();

    }

  }


  // =========================================
  // VIEW EMPLOYEE
  // =========================================

  viewEmployee(id: string): void {

    this.router.navigate([
      '/employee-details',
      id
    ]);

  }


  // =========================================
  // ACTIVATE EMPLOYEE
  // =========================================

  activateEmployee(id: string): void {

    this.selectedEmployeeId = id;

    this.showActivatePopup = true;

  }


  // =========================================
  // CANCEL ACTIVATE
  // =========================================

  cancelActivate(): void {

    this.showActivatePopup = false;

    this.selectedEmployeeId = '';

  }


  // =========================================
  // CONFIRM ACTIVATE
  // =========================================

  confirmActivate(): void {

    if (!this.selectedEmployeeId) {

      return;

    }


    this.viewEmployeesService
      .activateEmployee(
        this.selectedEmployeeId
      )
      .subscribe({

        next: (res: any) => {

          this.snack.success(
            res.message ||
            'Employee Activated Successfully'
          );


          this.showActivatePopup =
            false;


          this.selectedEmployeeId =
            '';


          this.loadInactiveEmployees();

        },


        error: (err) => {

          console.log(
            'ACTIVATE ERROR:',
            err
          );


          this.snack.error(
            err.error?.message ||
            'Unable to activate employee'
          );

        }

      });

  }


  // =========================================
  // NO EMPLOYEES
  // =========================================

  noEmployee(): boolean {

    return this.displayedEmployees.length === 0;

  }


  // =========================================
  // BACK
  // =========================================

  back(){
    this.router.navigate(['/view-employees']);
  }

}