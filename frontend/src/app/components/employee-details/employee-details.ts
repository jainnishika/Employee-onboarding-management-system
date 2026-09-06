import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeDetailsService } from '../../services/employee-details';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  employee: any = {};
  constructor(
    private route: ActivatedRoute,
    private employeeDetailsService: EmployeeDetailsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Employee ID:", id); 
    if (id) {
      this.loadEmployee(id);
    }
  }
  loadEmployee(id: string) {

    this.employeeDetailsService.getEmployeeDetails(id).subscribe({

      next: (res: any) => {
        console.log("Employee Details:", res); // Log the employee details to the console
        this.employee = res;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  back() {
    this.router.navigate(['/view-employees']);
  }
edit() {

    this.router.navigate([
        '/edit-employee',
        this.employee._id
    ]);

}
}