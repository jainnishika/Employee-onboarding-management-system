import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { EmployeeProfileService } from '../../services/employee-profile';
import { EmployeeRequestService } from '../../services/employee-request';
import { SnackbarService } from '../../services/snackbar';
import { DocumentUploadService } from '../../services/document-upload';

@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-details.html',
  styleUrl: './edit-details.css'
})
export class EditDetails implements OnInit {

  employee: any = {

    additionalDetails: {

      emergencyContactName: "",
      emergencyContactNumber: "",
      bloodGroup: "",
      maritalStatus: "Single",
      spouseName: "",
      spouseOccupation: "",
      nomineeName: "",
      relationship: "",
      nomineePhone: "",
      transportFacility: "No",
      hra: "No",
      aadhaar: "",
      pan: "",
      previousServices: []

    },

    documents: {}

  };

  previousServices: any[] = [

    {

      organisation: "",
      fromDate: "",
      toDate: "",
      tenure: "",
      experienceCertificate: ""

    }

  ];

  selectedFiles: any = {};

  constructor(

    private employeeProfileService: EmployeeProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private employeeRequestService: EmployeeRequestService,
    private snack: SnackbarService,
    private documentUploadService: DocumentUploadService

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

        console.log("Employee Profile:", res);

        this.employee = {
          ...res,
          additionalDetails: {

            emergencyContactName:
              res.additionalDetails?.emergencyContactName || "",
            emergencyContactNumber:
              res.additionalDetails?.emergencyContactNumber || "",
            bloodGroup:
              res.additionalDetails?.bloodGroup || "",
            maritalStatus:
              res.additionalDetails?.maritalStatus || "Single",
            spouseName:
              res.additionalDetails?.spouseName || "",
            spouseOccupation:
              res.additionalDetails?.spouseOccupation || "",
            nomineeName:
              res.additionalDetails?.nomineeName || "",
            relationship:
              res.additionalDetails?.relationship || "",
            nomineePhone:
              res.additionalDetails?.nomineePhone || "",
            transportFacility:
              res.additionalDetails?.transportFacility || "No",
            hra:
              res.additionalDetails?.hra || "No",
            aadhaar:
              res.additionalDetails?.aadhaar || "",
            pan:
              res.additionalDetails?.pan || "",
            previousServices:
              res.additionalDetails?.previousServices || []
          }
        };
        this.previousServices =
          res.additionalDetails?.previousServices?.length
            ? [...res.additionalDetails.previousServices.map((service: any) => ({
                ...service,
                fromDate: service.fromDate ? service.fromDate.split("T")[0] : "",
                toDate: service.toDate ? service.toDate.split("T")[0] : ""
              }))]
            : [
                {
                  organisation: "",
                  fromDate: "",
                  toDate: "",
                  tenure: "",
                  experienceCertificate: ""
                }
              ];
        if (this.employee.dob) {
          this.employee.dob =
            this.employee.dob.split("T")[0];
        }
        if (this.employee.joiningDate) {
          this.employee.joiningDate =
            this.employee.joiningDate.split("T")[0];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onFileSelected(event: any, type: string) {
    if (event.target.files.length > 0) {
      this.selectedFiles[type] =
        event.target.files[0];
    }
  }

  onExperienceCertificateSelected(event: any, index: number) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    // Store each certificate with a unique key
    this.selectedFiles[`experienceCertificate_${index}`] = file;
    // Keep it in the service object temporarily
    this.previousServices[index].experienceCertificate = file;
  }
}
  uploadDocuments() {
    const formData = new FormData();
    Object.keys(this.selectedFiles).forEach(key => {
      formData.append(
        key,
        this.selectedFiles[key]
      );
    });

    return this.documentUploadService
      .uploadDocuments(formData);
  }

  submit() {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(this.employee.phone)) {
      this.snack.error(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }
    const aadhaarRegex =
      /^(?!([0-9])\1{11})\d{12}$/;

    const aadhaar =
      this.employee.additionalDetails.aadhaar?.trim();
    if (aadhaar && !aadhaarRegex.test(aadhaar)) {
      this.snack.error(
        "Please enter a valid Aadhaar number."
      );
      return;
    }
    const panRegex =
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    const pan =
      this.employee.additionalDetails.pan
        ?.trim()
        .toUpperCase();
    this.employee.additionalDetails.pan = pan;

    if (pan && !panRegex.test(pan)) {

      this.snack.error(
        "Please enter a valid PAN number."
      );
      return;
    }

    if (
      this.employee.additionalDetails.transportFacility === "Yes"
    ) {

      if (
        !this.selectedFiles.licence ||
        !this.selectedFiles.rc ||
        !this.selectedFiles.vehicle
      ) {
        this.snack.error(
          "Please upload Driving Licence, RC and Vehicle Documents."
        );
        return;
      }
    }
    this.employee.additionalDetails.previousServices =
      this.previousServices;
    this.uploadDocuments().subscribe({
      next: (uploadRes: any) => {
        this.employee.documents =
          uploadRes.documents;
          Object.keys(uploadRes.experienceCertificates || {}).forEach(key => {
  const index = Number(key.split("_")[1]);

  if (!isNaN(index)) {
    this.previousServices[index].experienceCertificate =
      uploadRes.experienceCertificates[key];
  }
});

this.employee.additionalDetails.previousServices = this.previousServices;
console.log(
  "========== FINAL REQUEST DATA =========="
);

console.log(
  "Previous Services:",
  this.employee.additionalDetails.previousServices
);

console.log(
  "Complete Employee:",
  this.employee
);

        this.employeeRequestService
          .submitRequest(this.employee)
          .subscribe({
            next: (res: any) => {
              this.snack.success(res.message);
              const role =
                localStorage.getItem("role");
              if (role === "Admin") {
                this.router.navigate([
                  "/admin-dashboard"
                ]);
              }
              else if (role === "HR") {
                this.router.navigate([
                  "/hr-dashboard"
                ]);
              }
              else {
                this.router.navigate([
                  "/employee-profile"
                ]);
              }
            },
            error: (err) => {
              this.snack.error(
                err.error.message
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
    back() {
    this.router.navigate(['/employee-profile']);
  }

  addService() {
    this.previousServices.push({
      organisation: "",
      fromDate: "",
      toDate: "",
      tenure: "",
      experienceCertificate: ""
    });
  }

  removeService(index: number) {
    if (this.previousServices.length > 1) {
      this.previousServices.splice(index, 1);
    }
  }

  calculateTenure(service: any) {
    if (!service.fromDate || !service.toDate) {
      service.tenure = "";
      return;
    }

    const start = new Date(service.fromDate);
    const end = new Date(service.toDate);
    if (end < start) {
      service.tenure = "";
      this.snack.error(
        "To Date cannot be earlier than From Date."
      );
      return;
    }
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    service.tenure = `${years} Years ${months} Months`;
  }
}