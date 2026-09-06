import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';
import { SnackbarService } from '../../services/snackbar';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    MatSnackBarModule,
    CommonModule,
    MatIconModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})


export class Login {

  // =========================
  // LOGIN
  // =========================

  username = "";
  password = "";

  hidePassword = true;


  // =========================
  // FORGOT PASSWORD
  // =========================

  forgotMode = false;

  verified = false;

  forgotUsername = "";
  forgotEmail = "";

  newPassword = "";
  confirmPassword = "";

  hideNewPassword = true;
  hideConfirmPassword = true;


  constructor(
    private auth: Auth,
    private router: Router,
    private snack: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // SHOW FORGOT PASSWORD
  // =========================

  showForgotPassword() {

    this.forgotMode = true;

    this.verified = false;

    this.forgotUsername = "";
    this.forgotEmail = "";

    this.newPassword = "";
    this.confirmPassword = "";

    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }


  // =========================
  // BACK TO LOGIN
  // =========================

  backToLogin() {

    this.forgotMode = false;

    this.verified = false;

    this.forgotUsername = "";
    this.forgotEmail = "";

    this.newPassword = "";
    this.confirmPassword = "";

    this.hidePassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }


  // =========================
  // VERIFY USER
  // =========================

  verifyUser() {

    if (!this.forgotUsername.trim()) {

      this.snack.error("Please enter username");

      return;
    }

    if (!this.forgotEmail.trim()) {

      this.snack.error("Please enter registered email");

      return;
    }


    const data = {

      username: this.forgotUsername,

      email: this.forgotEmail

    };


    this.auth.verifyUser(data).subscribe({

      next: (res: any) => {

        console.log("Verify response:", res);

        this.verified = true;

        this.cdr.detectChanges();

        this.snack.success(res.message);

      },

      error: (err) => {

        console.log("Verify error:", err);

        this.snack.error(
          err.error?.message || "Verification failed"
        );

      }

    });

  }


  // =========================
  // RESET FORGOT PASSWORD
  // =========================

  updateForgotPassword() {

    if (!this.newPassword) {

      this.snack.error("Please enter new password");

      return;
    }


    if (!this.confirmPassword) {

      this.snack.error("Please confirm your password");

      return;
    }


    if (this.newPassword !== this.confirmPassword) {

      this.snack.error("Passwords do not match");

      return;
    }


    const data = {

      username: this.forgotUsername,

      password: this.newPassword

    };


    this.auth.resetPassword(data).subscribe({

      next: (res: any) => {

        this.snack.success(res.message);

        this.backToLogin();

      },

      error: (err) => {

        this.snack.error(
          err.error?.message || "Password update failed"
        );

      }

    });

  }


  // =========================
  // LOGIN
  // =========================

  login() {

    if (!this.username.trim()) {

      this.snack.error("Please enter username");

      return;
    }


    if (!this.password) {

      this.snack.error("Please enter password");

      return;
    }


    const data = {

      username: this.username,

      password: this.password

    };


    this.auth.login(data).subscribe({

      next: (res: any) => {

        console.log("Login response:", res);

        localStorage.setItem(
          "token",
          res.token
        );

        localStorage.setItem(
          "username",
          res.username
        );

        localStorage.setItem(
          "role",
          res.role
        );


        this.snack.success(res.message);


        // First Login

        if (res.firstLogin) {

          this.router.navigate([
            '/update-password'
          ]);

        }

        // Admin

        else if (res.role === "Admin") {

          this.router.navigate([
            '/admin-dashboard'
          ]);

        }

        // HR

        else if (res.role === "HR") {

          this.router.navigate([
            '/hr-dashboard'
          ]);

        }

        // Employee

        else {

          this.router.navigate([
            '/employee-profile'
          ]);

        }

      },

      error: (err) => {

        console.log("Login error:", err);

        this.snack.error(
          err.error?.message || "Login failed"
        );

      }

    });

  }

}