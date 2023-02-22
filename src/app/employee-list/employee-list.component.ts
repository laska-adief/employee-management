import { NumberInput } from '@angular/cdk/coercion';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  displayedColumns: string[] = ['avatar', 'name', 'email', 'jobTitle', 'action'];
  dataSource = new MatTableDataSource<any>();
  employeeData: Employee[] = [];
  employeeCount: NumberInput | any= 0;
  noData: boolean = false;
  isWaitingForResponse: boolean = false;

  constructor(private router: Router, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  ngAfterViewInit(): void {
   this.dataSource.paginator = this.paginator;
  }

  getAllEmployee() {
    this.isWaitingForResponse = true;

    this.employeeService.getAllEmployee().subscribe({
      next: (res: Employee[]) => {
        if (res?.length) {
          this.isWaitingForResponse = false;
          this.employeeData = res;
          this.employeeCount = this.employeeData?.length;
          this.dataSource.data = this.employeeData;
          this.noData = false;
        } else {
          this.isWaitingForResponse = false;
          this.employeeData = [];
          this.employeeCount = 0;
          this.noData = true;
        }
      },
      error: (err: any) => {
        this.isWaitingForResponse = false;
        this.noData = true;
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err,
          icon: 'error'
        });
      },
    });
  }

  editEmployee(id: string) {
    console.log('id', id);
    const dataEmployeeEdit = this.employeeData.find(employee => employee.id === id);
    if(dataEmployeeEdit) {
      this.employeeService.selectDataEmployee(dataEmployeeEdit);
      this.router.navigate(['/edit', id]);
    }
  }

  viewEmployee(id:string) {
    const dataEmployee = this.employeeData.find(employee => employee.id === id);
    if(dataEmployee) {
      this.employeeService.selectDetailEmployee(dataEmployee);
      this.router.navigate(['/detail', id]);
    }
  }

}
