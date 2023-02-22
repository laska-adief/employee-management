import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';

Chart.register(...registerables);
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  employeeData: Employee[] = [];
  isWaitingForResponse: boolean = false;
  totalEmployee: Number = 0;
  chart: any;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getDataEmployee();
  }

  getDataEmployee() {
    this.isWaitingForResponse = true;
    this.employeeService.getAllEmployee().subscribe({
      next: (res: Employee[]) => {
        if (res?.length) {
          this.isWaitingForResponse = false;
          this.employeeData = res;
          this.totalEmployee = this.employeeData.length;

          this.setGenderChart();
          this.setCountryChart();
        } else {
          this.isWaitingForResponse = false;
          this.employeeData = [];
          this.totalEmployee = 0;
        }
      },
      error: (err:any) => {
        this.isWaitingForResponse = false;
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err,
          icon: 'error'
        });
      }
    });
  }

  setGenderChart() {
    const canvas = "genderChart";
    const label = ['Male', 'Female'];
    let male = 0;
    let female = 0;
    this.employeeData.forEach((data) => {
      if(data.gender === 'male') {
        male = male + 1;
      } else if(data.gender === 'female') {
        female++
      }
    });
    const data:number[] = [male, female];
    const color = ['blue', 'red'];
    const type = 'pie';

    console.log(canvas, label, data, color, type);
    this.renderChart(canvas, label, data, color, type, true);
  }

  setCountryChart() {
    const canvas = "countryChart";
    
    const countryOccured = this.employeeData.reduce((acc:any, curr:any) => {
      return acc[curr.country] ? ++acc[curr.country] : acc[curr.country] = 1, acc
    }, {});
    
    const label:string[] = Object.keys(countryOccured);
    const data:string[] = Object.values(countryOccured);
    const color = data.map((data) => this.getRandomColor());
    const type = 'bar';

    console.log(canvas, label, data, color, type);
    this.renderChart(canvas, label, data, color, type, false);
  }

  renderChart(canvas:string, label:any, data:any, color:any, type:any, legend:boolean) {
    this.chart = new Chart(canvas, {
      type: type,

      data: {
        labels: label, 
	       datasets: [
          {
            label: '',
            data: data,
            backgroundColor: color
          }
        ]
      },
      options: {
        aspectRatio:3,
        plugins: {
          legend: {
            display: legend
          }
        }
      }
      
    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
