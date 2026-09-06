import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEmployeeService } from '../../services/edit-employee';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css'
})
export class EditEmployee implements OnInit {

  id = "";
  showConfirmPopup = false;

  // =========================
  // EMPLOYEE DETAILS
  // =========================

  employee: any = {

    name: "",
    dob: "",
    age: null,

    email: "",
    phone: "",

    gender: "",
    department: "",
    designation: "",
    

    joiningDate: "",
    address: "",

    role: "Employee",

    username: "",

    // =========================
    // ADDITIONAL DETAILS
    // =========================

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

    // =========================
    // DOCUMENTS
    // =========================

    documents: {

      profilePhoto: "",
      aadhaar: "",
      pan: "",
      resume: "",
      licence: "",
      rc: "",
      vehicle: ""

    }

  };


  // =========================
  // NEW FILES
  // =========================

  selectedDocuments: any = {

    profilePhoto: null,
    aadhaar: null,
    pan: null,
    resume: null,
    licence: null,
    rc: null,
    vehicle: null

  };


  constructor(

    private route: ActivatedRoute,

    private editEmployeeService:
      EditEmployeeService,

    private router: Router,

    private cdr: ChangeDetectorRef,

    private snack: SnackbarService

  ) {}


  ngOnInit(): void {

    const employeeId =
      this.route.snapshot.paramMap.get('id');

    if (employeeId) {

      this.id = employeeId;

      this.loadEmployee(employeeId);

    }

  }


  // =========================
  // LOAD EMPLOYEE
  // =========================

  loadEmployee(id: string) {

    this.editEmployeeService
      .getEmployee(id)
      .subscribe({

        next: (res: any) => {

          console.log(
            "EMPLOYEE:",
            res
          );

          this.employee = res;


          // =========================
          // DATE FORMATTING
          // =========================

          if (this.employee.dob) {

            this.employee.dob =
              this.employee.dob
                .split('T')[0];

          }


          if (this.employee.joiningDate) {

            this.employee.joiningDate =
              this.employee.joiningDate
                .split('T')[0];

          }


          // =========================
          // ADDITIONAL DETAILS
          // =========================

          if (!this.employee.additionalDetails) {

            this.employee.additionalDetails = {};

          }


          const additional =
            this.employee.additionalDetails;


          additional.emergencyContactName =
            additional.emergencyContactName || "";

          additional.emergencyContactNumber =
            additional.emergencyContactNumber || "";

          additional.bloodGroup =
            additional.bloodGroup || "";

          additional.maritalStatus =
            additional.maritalStatus || "Single";

          additional.spouseName =
            additional.spouseName || "";

          additional.spouseOccupation =
            additional.spouseOccupation || "";

          additional.nomineeName =
            additional.nomineeName || "";

          additional.relationship =
            additional.relationship || "";

          additional.nomineePhone =
            additional.nomineePhone || "";

          additional.transportFacility =
            additional.transportFacility || "No";

          additional.hra =
            additional.hra || "No";

          additional.aadhaar =
            additional.aadhaar || "";

          additional.pan =
            additional.pan || "";


          // =========================
          // PREVIOUS SERVICES
          // =========================

          if (
            !Array.isArray(
              additional.previousServices
            )
          ) {

            additional.previousServices = [];

          }


          // =========================
          // DOCUMENTS
          // =========================

          if (!this.employee.documents) {

            this.employee.documents = {};

          }


          this.employee.documents.profilePhoto =
            this.employee.documents.profilePhoto || "";

          this.employee.documents.aadhaar =
            this.employee.documents.aadhaar || "";

          this.employee.documents.pan =
            this.employee.documents.pan || "";

          this.employee.documents.resume =
            this.employee.documents.resume || "";

          this.employee.documents.licence =
            this.employee.documents.licence || "";

          this.employee.documents.rc =
            this.employee.documents.rc || "";

          this.employee.documents.vehicle =
            this.employee.documents.vehicle || "";


          // =========================
          // CALCULATE AGE
          // =========================

          this.calculateAge();


          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }
  confirmUpdate() {

  this.showConfirmPopup = true;

}


  // =========================
  // CALCULATE AGE
  // =========================

  calculateAge() {

    if (!this.employee.dob) {

      this.employee.age = null;

      return;

    }

    const birthDate =
      new Date(this.employee.dob);

    const today =
      new Date();

    let age =
      today.getFullYear()
      - birthDate.getFullYear();

    const month =
      today.getMonth()
      - birthDate.getMonth();

    if (
      month < 0 ||
      (
        month === 0 &&
        today.getDate()
        < birthDate.getDate()
      )
    ) {

      age--;

    }

    this.employee.age = age;

  }


  // =========================
  // ADD SERVICE
  // =========================

  addService() {

    this.employee
      .additionalDetails
      .previousServices
      .push({

        organisation: "",

        fromDate: "",

        toDate: "",

        tenure: "",

        experienceCertificate: ""

      });

  }


  // =========================
  // REMOVE SERVICE
  // =========================

  removeService(index: number) {

    this.employee
      .additionalDetails
      .previousServices
      .splice(index, 1);

  }


  // =========================
  // CALCULATE TENURE
  // =========================

  calculateTenure(index: number) {

    const service =
      this.employee
        .additionalDetails
        .previousServices[index];


    if (
      !service.fromDate ||
      !service.toDate
    ) {

      service.tenure = "";

      return;

    }


    const from =
      new Date(service.fromDate);

    const to =
      new Date(service.toDate);


    if (to < from) {

      service.tenure = "";

      return;

    }


    let years =
      to.getFullYear()
      - from.getFullYear();

    let months =
      to.getMonth()
      - from.getMonth();


    if (months < 0) {

      years--;

      months += 12;

    }


    if (to.getDate() < from.getDate()) {

      months--;

      if (months < 0) {

        years--;

        months += 12;

      }

    }


    if (years > 0 && months > 0) {

      service.tenure =
        `${years} year${years > 1 ? 's' : ''} ` +
        `${months} month${months > 1 ? 's' : ''}`;

    }

    else if (years > 0) {

      service.tenure =
        `${years} year${years > 1 ? 's' : ''}`;

    }

    else {

      service.tenure =
        `${months} month${months > 1 ? 's' : ''}`;

    }

  }


  // =========================
  // DOCUMENT SELECT
  // =========================

  onDocumentSelected(
    event: any,
    documentType: string
  ) {

    const file =
      event.target.files?.[0];

    if (file) {

      this.selectedDocuments[
        documentType
      ] = file;

    }

  }


  // =========================
  // EXPERIENCE CERTIFICATE
  // =========================

  onExperienceCertificateSelected(
    event: any,
    index: number
  ) {

    const file =
      event.target.files?.[0];

    if (file) {

      const service =
        this.employee
          .additionalDetails
          .previousServices[index];

      service.experienceCertificateFile =
        file;

    }

  }


  // =========================
  // UPDATE EMPLOYEE
  // =========================

  updateEmployee() {

  const formData = new FormData();


  // =========================
  // BASIC DETAILS
  // =========================

  formData.append(
    "name",
    this.employee.name
  );

  formData.append(
    "dob",
    this.employee.dob
  );

  formData.append(
    "age",
    this.employee.age?.toString() || ""
  );

  formData.append(
    "email",
    this.employee.email
  );

  formData.append(
    "phone",
    this.employee.phone
  );

  formData.append(
    "gender",
    this.employee.gender
  );

  formData.append(
    "department",
    this.employee.department
  );

  formData.append(
    "designation",
    this.employee.designation
  );

  formData.append(
    "joiningDate",
    this.employee.joiningDate
  );

  formData.append(
    "address",
    this.employee.address
  );

  formData.append(
    "role",
    this.employee.role
  );


  // =========================
  // ADDITIONAL DETAILS
  // =========================

  const additionalDetails = {

    ...this.employee.additionalDetails,

    previousServices:
      this.employee
        .additionalDetails
        .previousServices
        .map((service: any) => ({

          organisation:
            service.organisation,

          fromDate:
            service.fromDate,

          toDate:
            service.toDate,

          tenure:
            service.tenure,

          experienceCertificate:
            service.experienceCertificate || ""

        }))

  };


  formData.append(
    "additionalDetails",
    JSON.stringify(additionalDetails)
  );


  // =========================
  // NORMAL DOCUMENTS
  // =========================

  Object.keys(
    this.selectedDocuments
  ).forEach(type => {

    const file =
      this.selectedDocuments[type];

    if (file) {

      formData.append(
        type,
        file
      );

    }

  });


  // =========================
  // EXPERIENCE CERTIFICATES
  // =========================

  this.employee
    .additionalDetails
    .previousServices
    .forEach(
      (service: any, index: number) => {

        if (
          service.experienceCertificateFile
        ) {

          formData.append(

            `experienceCertificate_${index}`,

            service.experienceCertificateFile

          );

        }

      }
    );


  // =========================
  // API CALL
  // =========================

  this.editEmployeeService
    .updateEmployee(
      this.id,
      formData
    )
    .subscribe({

      next: (res: any) => {

        this.showConfirmPopup = false;

        this.snack.success(
          res.message
        );

        this.router.navigate(
          ['/view-employees']
        );

      },

      error: (err) => {

        this.showConfirmPopup = false;

        console.log(
          "UPDATE ERROR:",
          err
        );

        this.snack.error(
          err.error?.message ||
          "Unable to update employee"
        );

      }

    });

}


  // =========================
  // BACK
  // =========================

  back() {

    this.router.navigate(
      ['/view-employees']
    );

  }

}