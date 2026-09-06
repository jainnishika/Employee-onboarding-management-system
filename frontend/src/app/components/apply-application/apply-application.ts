import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApplicationService } from '../../services/application';
import { SnackbarService } from '../../services/snackbar';
import { DocumentUploadService } from '../../services/document-upload';

@Component({
  selector: 'app-apply-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-application.html',
  styleUrl: './apply-application.css'
})
export class ApplyApplication implements OnInit {

  application: any = {

    applicationType: "",

    applicationData: {

      leaveType: "",
      fromDate: "",
      toDate: "",
      lastWorkingDay: "",
      expenseType: "",
      amount: "",
      reason: ""

    }

  };

  // Today's date in YYYY-MM-DD format
  today: string = '';

  selectedFile: any = null;


  constructor(

    private applicationService: ApplicationService,

    private documentUploadService: DocumentUploadService,

    private snack: SnackbarService,

    private router: Router

  ) {}


  // =========================================================
  // INITIALIZE
  // =========================================================

  ngOnInit(): void {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    this.today = `${year}-${month}-${day}`;

  }


  // =========================================================
  // FILE SELECTION
  // =========================================================

  onFileSelected(event: any) {

    if (
      event.target.files &&
      event.target.files.length > 0
    ) {

      this.selectedFile =
        event.target.files[0];

    }

  }


  // =========================================================
  // UPLOAD DOCUMENT
  // =========================================================

  uploadDocument() {

    const formData = new FormData();

    if (this.selectedFile) {

      formData.append(
        "applicationLetter",
        this.selectedFile
      );

    }

    return this.documentUploadService
      .uploadDocuments(formData);

  }


  // =========================================================
  // GENERAL FORM VALIDATION
  // =========================================================

  validateForm(): boolean {

    // Application type
    if (!this.application.applicationType) {

      this.snack.error(
        "Please select application type."
      );

      return false;

    }


    // Reason
    if (
      !this.application.applicationData.reason?.trim()
    ) {

      this.snack.error(
        "Please enter reason."
      );

      return false;

    }


    // Required document
    if (

      this.application.applicationType === "Resignation" ||

      this.application.applicationType === "Reimbursement"

    ) {

      if (!this.selectedFile) {

        this.snack.error(
          "Please upload the required document."
        );

        return false;

      }

    }


    return true;

  }


  // =========================================================
  // DATE VALIDATION
  // =========================================================

  validateDates(): boolean {

    const type =
      this.application.applicationType;


    // =======================================================
    // LEAVE
    // =======================================================

    if (type === "Leave") {

      const fromDate =
        this.application.applicationData.fromDate;

      const toDate =
        this.application.applicationData.toDate;


      // From Date required
      if (!fromDate) {

        this.snack.error(
          "Please select From Date."
        );

        return false;

      }


      // To Date required
      if (!toDate) {

        this.snack.error(
          "Please select To Date."
        );

        return false;

      }


      // From Date cannot be in the past
      if (fromDate < this.today) {

        this.snack.error(
          "Leave From Date cannot be a past date."
        );

        return false;

      }


      // To Date cannot be in the past
      if (toDate < this.today) {

        this.snack.error(
          "Leave To Date cannot be a past date."
        );

        return false;

      }


      // From Date cannot be after To Date
      if (fromDate > toDate) {

        this.snack.error(
          "From Date cannot be greater than To Date."
        );

        return false;

      }

    }


    // =======================================================
    // WORK FROM HOME
    // =======================================================

    if (type === "Work From Home") {

      const fromDate =
        this.application.applicationData.fromDate;

      const toDate =
        this.application.applicationData.toDate;


      // From Date required
      if (!fromDate) {

        this.snack.error(
          "Please select From Date."
        );

        return false;

      }


      // To Date required
      if (!toDate) {

        this.snack.error(
          "Please select To Date."
        );

        return false;

      }


      // From Date cannot be in the past
      if (fromDate < this.today) {

        this.snack.error(
          "Work From Home From Date cannot be a past date."
        );

        return false;

      }


      // To Date cannot be in the past
      if (toDate < this.today) {

        this.snack.error(
          "Work From Home To Date cannot be a past date."
        );

        return false;

      }


      // From Date cannot be after To Date
      if (fromDate > toDate) {

        this.snack.error(
          "From Date cannot be greater than To Date."
        );

        return false;

      }

    }


    // =======================================================
    // RESIGNATION
    // =======================================================

    if (type === "Resignation") {

      const lastWorkingDay =
        this.application.applicationData.lastWorkingDay;


      // Last working day required
      if (!lastWorkingDay) {

        this.snack.error(
          "Please select Last Working Day."
        );

        return false;

      }


      // Cannot select past date
      if (lastWorkingDay < this.today) {

        this.snack.error(
          "Last Working Day cannot be a past date."
        );

        return false;

      }

    }


    return true;

  }


  // =========================================================
  // FROM DATE CHANGED
  // =========================================================

  onFromDateChange(): void {

    const fromDate =
      this.application.applicationData.fromDate;

    const toDate =
      this.application.applicationData.toDate;


    /*
      If user changes From Date to a date
      after the currently selected To Date,
      clear To Date.
    */

    if (

      fromDate &&

      toDate &&

      toDate < fromDate

    ) {

      this.application.applicationData.toDate = "";

    }

  }


  // =========================================================
  // SUBMIT APPLICATION
  // =========================================================

  submitApplication() {


    // First validate general form
    if (!this.validateForm()) {

      return;

    }


    // Then validate dates
    if (!this.validateDates()) {

      return;

    }


    // Upload document
    this.uploadDocument().subscribe({

      next: (uploadRes: any) => {


        this.application.documents = {

          applicationLetter:
            uploadRes.applicationLetter

        };


        // Submit application
        this.applicationService
          .submitApplication(this.application)
          .subscribe({

            next: (res: any) => {

              this.snack.success(
                res.message
              );

              this.router.navigate([
                '/employee-profile'
              ]);

            },


            error: (err) => {

              console.log(err);

              this.snack.error(
                err.error?.message ||
                "Application submission failed."
              );

            }

          });

      },


      error: (err) => {

        console.log(err);

        this.snack.error(
          "Document upload failed."
        );

      }

    });

  }


  // =========================================================
  // BACK
  // =========================================================

  back() {

    this.router.navigate([
      '/employee-profile'
    ]);

  }

}