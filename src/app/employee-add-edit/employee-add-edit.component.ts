import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html',
  styleUrls: ['./employee-add-edit.component.scss'],
})
export class EmployeeAddEditComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  isWaitingForResponse: boolean = false;
  sub!: Subscription;
  action: string = '';
  selectedIdEditEmployee: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeFormInit();
    this.getActionAndParam();
  }

  getActionAndParam() {
    this.sub = this.route.url.subscribe((url) => {
      if (url?.length) {
        if (url[0].path === 'add') {
          this.action = 'add';
        } else if (url[0]?.path === 'edit') {
          this.action = 'edit';
          const idEmployee = url[1]?.path;
          if (idEmployee) {
            this.selectedIdEditEmployee = idEmployee;
            this.getSelectedEditEmployee();
          }
        }
      }
    });
  }

  employeeFormInit() {
    this.employeeForm = this.fb.group({
      gender: ['male', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      avatar: ['', Validators.required],
      birthDate: ['', Validators.required],
      jobTitle: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  onSubmitEmployee() {
    if (!this.employeeForm.valid) {
      Swal.fire({
        title: 'Form Not Complete',
        text: "You still haven't filled all required form",
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1976d2',
      });
      return;
    }

    if (this.action === 'add') {
      this.addEmployee();
    } else if (this.action === 'edit') {
      this.editEmployee();
    }
  }

  addEmployee() {
    let employeeData = this.employeeForm.value;
    employeeData.fullName =
      this.employeeForm.value.firstName +
      ' ' +
      this.employeeForm.value.lastName;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will add new employee',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isWaitingForResponse = true;
        this.employeeService.addEmployee(employeeData).subscribe({
          next: (res) => {
            if (res) {
              this.isWaitingForResponse = false;
              Swal.fire({
                title: 'Bravo!',
                text: 'New Employee Added',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1976d2',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/list']);
                }
              });
            }
          },
          error: (err: any) => {
            this.isWaitingForResponse = false;
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: err,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#1976d2',
            });
          },
        });
      }
    });
  }

  getSelectedEditEmployee() {
    const dataSelected = this.employeeService.selectedDataEditEmployee;
    if (dataSelected && dataSelected.id === this.selectedIdEditEmployee) {
      this.employeeForm.patchValue(dataSelected);
      console.log(dataSelected);
    } else {
      this.router.navigate(['/list']);
    }
  }

  editEmployee() {
    let employeeId = this.selectedIdEditEmployee;
    let employeeData = this.employeeForm.value;
    employeeData.fullName =
      this.employeeForm.value.firstName +
      ' ' +
      this.employeeForm.value.lastName;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will update data employee',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isWaitingForResponse = true;
        this.employeeService.editEmployee(employeeId, employeeData).subscribe({
          next: (res) => {
            if (res) {
              this.isWaitingForResponse = false;
              Swal.fire({
                title: 'Bravo!',
                text: 'Employee Updated',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1976d2',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/list']);
                }
              });
            }
          },
          error: (err: any) => {
            this.isWaitingForResponse = false;
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: err,
              icon: 'error',
            });
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
