import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule,MatSnackBarModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  name = "";
  dob = "";
  age: number | null = null;
  email = "";

  username = "";
  password = "";

  maxDate = "";
  userCreated= false;

  constructor(
    private signupService: SignupService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: SnackbarService
  ) {

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0];

  }

  calculateAge() {

    if (!this.dob) return;

    const birthDate = new Date(this.dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear() + 1;

    const month = today.getMonth() - birthDate.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.age = age;

  }

  createUser() {

    if (!this.name.trim()) {
      this.snack.error("Name is required");
      return;
    }

    if (!this.dob) {
      this.snack.error("Date of Birth is required");
      return;
    }

    if (this.age === null || this.age < 18) {
      this.snack.error("User must be at least 18 years old.");
      return;
    }

    if (!this.email.trim()) {
      this.snack.error("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {
      this.snack.error("Enter a valid email");
      return;
    }

    const data = {

      name: this.name,
      dob: this.dob,
      age: this.age,
      email: this.email

    };

    this.signupService.signup(data).subscribe({

      next: (res: any) => {

        this.username = res.username;
        this.password = res.password;
        this.userCreated= true;

        this.snack.success( res.message);

        // Clear form
        this.name = "";
        this.dob = "";
        this.age = null;
        this.email = "";
        this.cdr.detectChanges();
        // Optional: go back to login page
        // this.router.navigate(['/']);

      },

      error: (err) => {

        this.snack.error(err.error.message);

      }

    });

  }

  goToLogin() {

    this.router.navigate(['/']);

  }

}