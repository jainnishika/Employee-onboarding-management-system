import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeRequestService } from '../../services/employee-request';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements OnInit {

  username = "";

  requestStatus = "No Request";

  remarks = "";
  reviewedBy = "";
  reviewedAt= "";

  constructor(
    private router: Router,
    private employeeRequestService: EmployeeRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.username = localStorage.getItem("username") || "Employee";

    this.loadRequestStatus();

  }

  loadRequestStatus() {

  console.log("Username from localStorage:", this.username);

  this.employeeRequestService.getStatus(this.username).subscribe({

    next: (res: any) => {

      console.log("API Response:", res);

      this.requestStatus = res.status;

      this.remarks = res.remarks || "";
      this.reviewedBy = res.reviewedBy || "";
      this.reviewedAt = res.reviewedAt || "";
      this.cdr.detectChanges();

    },

    error: (err) => {

      console.log("API Error:", err);

      this.requestStatus = "No Request";

    }

  });

}

  myProfile() {
    this.router.navigate(['/employee-profile']);
  }

  changePassword() {
    this.router.navigate(['/update-password'], {
      queryParams: { from: 'dashboard' }
    });
  }
  applyApplication(){
    this.router.navigate(['/apply-application']);
}
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}