import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  employeeData!: Employee;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.getDataEmployee();
  }

  getDataEmployee() {
    const employee = this.employeeService.selectedDataDetailEmployee;
    if(employee) {
      this.employeeData = employee;
    } else {
      this.router.navigate(['/list']);
    }
  }

}
