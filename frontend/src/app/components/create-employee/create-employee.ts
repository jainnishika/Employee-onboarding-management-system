import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreateEmployeeService } from '../../services/create-employee';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [FormsModule, CommonModule,MatSnackBarModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css',
})

export class CreateEmployee {

  name = "";
  dob = "";
  age: number | null = null;
  email = "";
  phone = "";
  gender = "";
  department = "";
  designation = "";
  joiningDate = "";
  address = "";
  role = "Employee";
  loggedInRole = localStorage.getItem("role");

  username = "";
  password = "";
  previousServices: any[] = [];

  userCreated = false;
  maxDate = "";

  // Validation Errors
  nameError = "";
  dobError = "";
  ageError = "";
  emailError = "";
  phoneError = "";
  genderError = "";
  departmentError = "";
  designationError = "";
  joiningDateError = "";
  addressError = "";
  documents: any = {
  profilePhoto: null,
  aadhaar: null,
  pan: null,
  resume: null,
  licence: null,
  rc: null,
  vehicle: null
};

  constructor(
    private createEmployeeService: CreateEmployeeService,
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

    let age = today.getFullYear() - birthDate.getFullYear()+1;

    const month = today.getMonth() - birthDate.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.age = age;

  }

  createEmployee() {
    console.log("create employee")

    // Clear previous errors
    this.nameError = "";
    this.dobError = "";
    this.ageError = "";
    this.emailError = "";
    this.phoneError = "";
    this.genderError = "";
    this.departmentError = "";
    this.designationError = "";
    this.joiningDateError = "";
    this.addressError = "";

    let valid = true;

    if (!this.name.trim()) {
      this.nameError = "Name is required";
      valid = false;
    }

    if (!this.dob) {
      this.dobError = "Date of Birth is required";
      valid = false;
    }

    if (this.age == null || this.age < 18) {
      this.ageError = "Employee must be at least 18 years old";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {
      this.emailError = "Enter a valid email";
      valid = false;
    }

    if (!/^[6-9][0-9]{9}$/.test(this.phone)) {
    this.phoneError = "Enter a valid 10-digit phone number";
    valid = false;
}

    if (!this.gender) {
      this.genderError = "Please select gender";
      valid = false;
    }

    if (!this.department.trim()) {
      this.departmentError = "Department is required";
      valid = false;
    }

    if (!this.designation.trim()) {
      this.designationError = "Designation is required";
      valid = false;
    }

    if (!this.joiningDate) {
      this.joiningDateError = "Joining Date is required";
      valid = false;
    }

    if (!this.address.trim()) {
      this.addressError = "Address is required";
      valid = false;
    }

    if (!valid) {
      return;
    }

    const formData = new FormData();

formData.append("name", this.name);
formData.append("dob", this.dob);
formData.append("age", this.age?.toString() || "");
formData.append("email", this.email);
formData.append("phone", this.phone);
formData.append("gender", this.gender);
formData.append("department", this.department);
formData.append("designation", this.designation);
formData.append("joiningDate", this.joiningDate);
formData.append("address", this.address);
formData.append("role", this.role);
formData.append(
  "previousServices",
  JSON.stringify(
    this.previousServices.map(service => ({
      organisation: service.organisation,
      fromDate: service.fromDate,
      toDate: service.toDate,
      tenure: service.tenure
    }))
  )
);
this.previousServices.forEach((service, index) => {

  if (service.experienceCertificate) {

    formData.append(
      `experienceCertificate_${index}`,
      service.experienceCertificate
    );

  }

});
if (this.documents.profilePhoto) {

  formData.append(
    "profilePhoto",
    this.documents.profilePhoto
  );

}

if (this.documents.aadhaar) {

  formData.append(
    "aadhaar",
    this.documents.aadhaar
  );

}

if (this.documents.pan) {

  formData.append(
    "pan",
    this.documents.pan
  );

}

if (this.documents.resume) {

  formData.append(
    "resume",
    this.documents.resume
  );

}

if (this.documents.licence) {

  formData.append(
    "licence",
    this.documents.licence
  );

}

if (this.documents.rc) {

  formData.append(
    "rc",
    this.documents.rc
  );

}

if (this.documents.vehicle) {

  formData.append(
    "vehicle",
    this.documents.vehicle
  );

}
    this.createEmployeeService.createEmployee(formData).subscribe({

      next: (res: any) => {

        this.username = res.username;
        this.password = res.password;
        this.userCreated = true;
        // Clear Form
        this.name = "";
        this.dob = "";
        this.age = null;
        this.email = "";
        this.phone = "";
        this.gender = "";
        this.department = "";
        this.designation = "";
        this.joiningDate = "";
        this.address = "";
        this.role = "Employee";
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snack.error(err.error.message);
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/']);
  }
  goBack() {
    if (this.role === "HR") {
      this.router.navigate(['/hr-dashboard']);
    } else {
      this.router.navigate(['/admin-dashboard']);
    }
  }
  calculateTenure(index: number) {

  const service = this.previousServices[index];

  if (!service.fromDate || !service.toDate) {
    service.tenure = "";
    return;
  }

  const from = new Date(service.fromDate);
  const to = new Date(service.toDate);

  if (to < from) {
    service.tenure = "";
    return;
  }

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let result = "";

  if (years > 0) {
    result += years + (years === 1 ? " Year " : " Years ");
  }

  if (months > 0) {
    result += months + (months === 1 ? " Month" : " Months");
  }

  if (!result) {
    result = "Less than 1 Month";
  }

  service.tenure = result.trim();
}
  addService() {

  this.previousServices.push({
    organisation: '',
    fromDate: '',
    toDate: '',
    tenure: '',
    experienceCertificate: null
  });

}


removeService(index: number) {

  this.previousServices.splice(index, 1);

}


onExperienceCertificateSelected(
  event: any,
  index: number
) {

  const file = event.target.files[0];

  if (file) {

    this.previousServices[index].experienceCertificate = file;

  }

}
onDocumentSelected(
  event: any,
  documentType: string
) {

  const file = event.target.files[0];

  if (file) {

    this.documents[documentType] = file;

  }

}
}