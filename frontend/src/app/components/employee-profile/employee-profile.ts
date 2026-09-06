import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeProfileService } from '../../services/employee-profile';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.css'
})
export class EmployeeProfile implements OnInit {

  employee: any = {};
  // previousServices =[
  //   {
  //     organisation:"",
  //     fromDate: "",
  //     toDate: "",
  //     tenure: "",
  //     experienceCertificate: ""
  //   }
  // ]

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const username = localStorage.getItem("username");

    if (username) {
      this.loadProfile(username);
    }

  }

  loadProfile(username: string) {

    this.employeeProfileService.getProfile(username).subscribe({

      next: (res: any) => {

        console.log(res);

        this.employee = res;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  editDetails(){
    this.router.navigate(['/edit-details']);
  }
  // addService(){
  //   this.previousServices.push({
  //     organisation: "",
  //     fromDate: "",
  //     toDate: "",
  //     tenure: "",
  //     experienceCertificate: ""
  //   });
  // }
  
  // removeService(index: number){
  //   this.previousServices.splice(index,1);
  // }
  // calculateTenure(service: any){
  //   if(!service.fromDate || !service.toDate){
  //     return;}
  //     const start = new Date(service.fromDate);
  //     const end= new Date(service.toDate);
  //     let years = end.getFullYear() - start.getFullYear();
  //     let months = end.getMonth()-start.getMonth();
  //   if(months <0){
  //     years --;
  //   months +=12;    
  //  }
  //  service.tenure = years + "Years"+ months + "Months"
  // }
  
  back() {
    this.router.navigate(['/employee-profile']);
  }
}