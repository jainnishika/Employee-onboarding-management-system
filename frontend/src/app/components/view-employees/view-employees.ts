import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewEmployeesService } from '../../services/view-employees';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './view-employees.html',
  styleUrl: './view-employees.css',
})
export class ViewEmployees implements OnInit {

  // =====================================================
  // EMPLOYEE DATA
  // =====================================================

  employees: any[] = [];

  filteredEmployees: any[] = [];

  displayedEmployees: any[] = [];


  // =====================================================
  // SEARCH
  // =====================================================

  searchText = "";


  // =====================================================
  // FILTERS
  // =====================================================

  selectedDepartment = "";

  selectedRole = "";

  selectedDesignation = "";

  departments: string[] = [];

  roles: string[] = [];

  designations: string[] = [];


  // =====================================================
  // PAGINATION
  // =====================================================

  itemsPerPage = 10;

  selectedCount = 10;

  currentPage = 1;

  totalPages = 1;

  pageNumbers: number[] = [];


  // =====================================================
  // SORTING
  // =====================================================

  sortBy = "name";

  sortOrder = "asc";


  // =====================================================
  // DEACTIVATE / ACTIVATE
  // =====================================================

  showDeactivatePopup = false;

  selectedEmployeeId = "";


  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

  role = localStorage.getItem("role");


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private viewEmployeesService: ViewEmployeesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: SnackbarService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadEmployees();

  }


  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  loadEmployees(): void {

    this.viewEmployeesService.getEmployees(

      this.currentPage,

      this.selectedCount,

      this.searchText,

      this.selectedDepartment,

      this.selectedRole,

      this.selectedDesignation,

      this.sortBy,

      this.sortOrder

    ).subscribe({

      next: (res: any) => {

        console.log(
          "API Response:",
          res
        );


        this.employees =
          res.employees || [];


        this.filteredEmployees =
          this.employees;


        this.displayedEmployees =
          res.employees || [];


        // =================================================
        // FILTER OPTIONS
        // =================================================

        this.departments = [
          ...new Set(
            this.employees
              .map(
                (e: any) => e.department
              )
              .filter(
                (x: any) => x
              )
          )
        ];


        this.roles = [
          ...new Set(
            this.employees
              .map(
                (e: any) => e.role
              )
              .filter(
                (x: any) => x
              )
          )
        ];


        this.designations = [
          ...new Set(
            this.employees
              .map(
                (e: any) => e.designation
              )
              .filter(
                (x: any) => x
              )
          )
        ];


        // =================================================
        // PAGINATION
        // =================================================

        this.totalPages =
          res.totalPages || 1;


        this.currentPage =
          res.currentPage || 1;


        this.pageNumbers =
          Array.from(
            {
              length: this.totalPages
            },
            (_, i) => i + 1
          );


        this.cdr.detectChanges();


        console.log(
          "Employees loaded:",
          this.employees
        );

      },


      error: (err) => {

        console.log(
          "GET EMPLOYEES ERROR:",
          err
        );


        this.employees = [];

        this.filteredEmployees = [];

        this.displayedEmployees = [];

      }

    });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  searchEmployees(): void {

    this.currentPage = 1;

    this.loadEmployees();

  }


  // =====================================================
  // SORT BY NAME
  // =====================================================

  sortName(): void {

    if (this.sortBy === "name") {

      this.sortOrder =
        this.sortOrder === "asc"
          ? "desc"
          : "asc";

    }

    else {

      this.sortBy = "name";

      this.sortOrder = "asc";

    }


    this.currentPage = 1;

    this.loadEmployees();

  }


  // =====================================================
  // FILTER
  // =====================================================

  applyFilters(): void {

    this.currentPage = 1;

    this.loadEmployees();

  }


  // =====================================================
  // RECORDS PER PAGE
  // =====================================================

  changeRecords(count: number): void {

    this.selectedCount =
      Number(count);

    this.currentPage = 1;

    this.loadEmployees();

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadEmployees();

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

      this.loadEmployees();

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

      this.loadEmployees();

    }

  }


  // =====================================================
  // CHECK NO EMPLOYEE
  // =====================================================

  noemployee(): boolean {

    return (
      this.filteredEmployees.length === 0
    );

  }


  // =====================================================
  // CREATE EMPLOYEE
  // =====================================================

  createEmployee(): void {

    this.router.navigate([
      '/create-employee'
    ]);

  }


  // =====================================================
  // BACK
  // =====================================================

  back(): void {

    const role =
      localStorage.getItem("role");


    if (role === "Admin") {

      this.router.navigate([
        '/admin-dashboard'
      ]);

    }

    else if (role === "HR") {

      this.router.navigate([
        '/hr-dashboard'
      ]);

    }

    else {

      this.router.navigate(['/']);

    }

  }


  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  viewEmployee(id: string): void {

    this.router.navigate([
      '/employee-details',
      id
    ]);

  }


  // =====================================================
  // EDIT EMPLOYEE
  // =====================================================

  editEmployee(id: string): void {

    this.router.navigate([
      '/edit-employee',
      id
    ]);

  }
  openInactiveEmployees(): void {

    this.router.navigate([
        '/inactive-employees'
    ]);

}


  // =====================================================
  // OPEN DEACTIVATE POPUP
  // =====================================================

  deactivateEmployee(id: string): void {

  this.selectedEmployeeId = id;

  setTimeout(() => {
    this.showDeactivatePopup = true;
  });

}

  // =====================================================
  // CONFIRM DEACTIVATE
  // =====================================================

  confirmDeactivate(): void {

    if (!this.selectedEmployeeId) {

      return;

    }


    this.viewEmployeesService
      .deactivateEmployee(
        this.selectedEmployeeId
      )
      .subscribe({

        next: (res: any) => {

          this.snack.success(
            res.message ||
            "Employee Deactivated Successfully"
          );


          this.showDeactivatePopup = false;

          this.selectedEmployeeId = "";

          this.loadEmployees();

        },


        error: (err) => {

          console.log(
            "DEACTIVATE ERROR:",
            err
          );


          this.snack.error(
            err.error?.message ||
            "Unable to deactivate employee"
          );


          this.showDeactivatePopup = false;

          this.selectedEmployeeId = "";

        }

      });

  }


  // =====================================================
  // CANCEL DEACTIVATE
 cancelDeactivate(): void {

  this.showDeactivatePopup = false;

  this.selectedEmployeeId = "";

}


  // =====================================================
  // ACTIVATE EMPLOYEE
  // =====================================================

  activateEmployee(id: string): void {

    this.viewEmployeesService
      .activateEmployee(id)
      .subscribe({

        next: (res: any) => {

          this.snack.success(
            res.message ||
            "Employee Activated Successfully"
          );

          this.loadEmployees();

        },


        error: (err) => {

          console.log(
            "ACTIVATE ERROR:",
            err
          );


          this.snack.error(
            err.error?.message ||
            "Unable to activate employee"
          );

        }

      });

  }


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  exportToExcel(): void {

    const excelData =
      this.filteredEmployees.map(
        (emp: any) => ({

          Name: emp.name,

          Username: emp.username,

          Email: emp.email,

          Phone: emp.phone,

          Department: emp.department,

          Designation: emp.designation,

          Role: emp.role,

          Status:
            emp.isActive === false
              ? "Inactive"
              : "Active",

          "Joining Date":
            emp.joiningDate
              ? new Date(
                  emp.joiningDate
                ).toLocaleDateString()
              : ""

        })
      );


    const worksheet:
      XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(
          excelData
        );


    const workbook:
      XLSX.WorkBook = {

        Sheets: {

          Employees:
            worksheet

        },

        SheetNames: [
          'Employees'
        ]

      };


    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: 'xlsx',
          type: 'array'
        }
      );


    const blob =
      new Blob(
        [excelBuffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        }
      );


    FileSaver.saveAs(
      blob,
      `Employees_${new Date().getTime()}.xlsx`
    );

  }

}