import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../services/dashboard';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-hr-dashboard',
  imports: [CommonModule, MatIconModule,RouterLink],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css',
})
export class HrDashboard {
   username = localStorage.getItem("username") || "";

  // Dashboard Counts
  //pendingRequests: any[]=[];
  totalEmployees = 0;
  totalAdmins = 0;
  totalHR = 0;
  totalDepartments = 0;
  firstLoginPending = 0;
  totalRoles = 0;
  // totalPendingRequests: any[]=[];
  // pendingApplications: any[]=[];
  pendingRequests = 0;
pendingApplications = 0;
totalPendingRequests = 0;
 

  // Lists from MongoDB
  employees: any[] = [];
  // admins: any[] = [];
  // hr: any[] = [];
  pending: any[] = [];
  departments: any[] = [];
  recentEmployees: any[] = [];

  // Popup
  showPopup = false;
  popupTitle = "";
  popupData: string[] = [];

  constructor(private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    
  ) {}

  ngOnInit(): void {


    this.dashboardService.getStats().subscribe({

      next: (res: any) => {
        console.log("Dashboard Response:",res);
        console.log("Pending Requests from API:", res.pendingRequests);
        console.log("First Login Pending:", res.firstLoginPending);
           console.log("total Pending:", res.totalPendingRequests);
        
        // Counts
        this.pendingRequests = res.pendingRequests;
        this.totalEmployees = res.totalEmployees;
        this.totalAdmins = res.totalAdmins;
        this.totalHR = res.totalHR;
        this.totalDepartments = res.totalDepartments;
        this.firstLoginPending = res.firstLoginPending;
        this.totalRoles = res.totalRoles;
        this.totalPendingRequests = res.totalPendingRequests;
        this.pendingApplications = res.pendingApplications;

        // Lists
        this.employees = res.employees || [];
        // this.admins = res.admins || [];
        // this.hr = res.hr || [];
        this.pending = res.pending || [];
        this.departments = res.departments || [];
        this.loadRecentEmployees();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // this.loading = false;
        console.log(err);
      }
    });
  }
  
  openCard(type: string) {
    this.showPopup = true;
    switch(type){
      case 'totalPendingRequests':
        // this.popupTitle = "Pending Profile Requets";
        // this.popupData = ["Opening pending requets page.."];
        // this.popupData = this.pending.map(
        //   (req:any)=> req.name
        // );
      
        this.router.navigate(['/request-management']);
        return;

      case 'employees':
        this.popupTitle = "Employee List";
      //   this.popupData = this.employees.map(
      //     (emp:any)=> emp.name
      //   );
      //   this.cdr.detectChanges()
      // break;
      this.router.navigate(['/view-employees']);
        return;
      
      // case 'admins':
      //   this.popupTitle = "Admin List";

      //   this.popupData = this.admins.map(
      //   (admin:any)=> `${admin.name || "Admin"} (${admin.username})`
      //   );

      // break;

      // case 'hr':

      //   this.popupTitle = "HR Employees";

      //   this.popupData = this.hr.map(
      //     (emp:any)=> emp.name
      //   );

      // break;

      case 'departments':
        this.popupTitle = "Departments";
        this.popupData = this.departments.map(
          (dept:any)=> `${dept._id} (${dept.count})`
        );

      break;
      case 'firstLogin':
        this.popupTitle = "Pending First Login";
        this.popupData = this.pending.map(
          (emp:any)=> emp.name
        );

      break;

      case 'roles':
        this.popupTitle = "Roles";
        this.popupData = [
          `Admins : ${this.totalAdmins}`,
          `HR : ${this.totalHR}`,
          `Employees : ${this.totalEmployees}`
        ];

      break;

    }

  }
  viewAllEmployees(){
    this.router.navigate(['/view-employees']);
  }
  loadRecentEmployees() {

  this.dashboardService.getRecentEmployees().subscribe({

    next: (res: any) => {
      console.log("recent:", res);
      this.recentEmployees = res;
      this.cdr.detectChanges();

    },

    error: (err) => {

      console.log(err);
    }
  });
}

  closePopup(){
    this.showPopup = false;

  }
}