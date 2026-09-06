import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-management.html',
  styleUrl: './request-management.css'
})

export class RequestManagement {
   pendingRequests: any[]=[];
   pendingApplications: any[] =[];

  constructor(private router: Router,private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,){}
    ngOnInit(): void {
      this.dashboardService.getStats().subscribe((res: any) => {

    this.pendingRequests = res.pendingRequests;
    console.log("pendingprofile:", res.pendingRequests);
    this.pendingApplications = res.pendingApplications;
     console.log("pendingapplications:", res.pendingApplications);
     this.cdr.detectChanges();

});


  //   this.dashboardService.getStats().subscribe({

  //     next: (res: any) => {
  //       this.pendingProfileRequests = res.pendingProfileRequests;
  //     this.pendingApplications = res.pendingApplications;
  //      this.cdr.detectChanges();

  //   },

  //   error: err => console.log(err)

  // });

}

  openProfileRequests() {

    this.router.navigate(['/profile-requests']);

  }

  openApplications(){

    this.router.navigate(['/application-requests']);

  }

  back(){

    const role = localStorage.getItem("role");

    if(role === "Admin"){

      this.router.navigate(['/admin-dashboard']);

    }

    else{

      this.router.navigate(['/hr-dashboard']);

    }

  }

}