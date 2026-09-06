import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormsModule,MatSnackBarModule,CommonModule,MatIconModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css'
})
export class UpdatePassword implements OnInit {

  username = localStorage.getItem("username") || "";

  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  loading = false;
  hideCurrentPassword = true;
hideNewPassword = true;
hideConfirmPassword = true;

  fromDashboard = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private snack: SnackbarService,
  ) {}

  ngOnInit(): void {
    console.log("Current URL:", this.router.url);
    console.log("Query Params:", this.route.snapshot.queryParamMap);

    this.fromDashboard =
      this.route.snapshot.queryParamMap.get('from') === 'dashboard';
          console.log("From Dashboard:", this.fromDashboard);

  }

  updatePassword() {
    this.loading = true;

    if (!this.currentPassword) {
     this.snack.error("Current Password is required");
      return;
    }

    if (!this.newPassword) {
      this.snack.error("New Password is required");
      return;
    }

    if (this.newPassword.length < 6) {
     this.snack.error("Password must be at least 6 characters");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.snack.error("Passwords do not match");
      return;
    }

    const data = {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.auth.updatePassword(data).subscribe({

      next: (res: any) => {

        this.snack.success(res.message);

        const role = localStorage.getItem("role");
        this.loading = false;

        // First login
        if (!this.fromDashboard) {

          localStorage.removeItem("username");

          this.router.navigate(['/']);

        }

        // Change Password from Dashboard
        else {

          if (role === "Admin") {

            this.router.navigate(['/admin-dashboard']);

          } else {

            this.router.navigate(['/employee-dashboard']);

          }

        }

      },

      error: (err) => {

        console.log(err);
        this.loading = false;

       this.snack.error(err.error.message);

      }

    });

  }

}