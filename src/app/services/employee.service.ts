import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  readonly URL:string = 'https://63f48a7a55677ef68bbe3578.mockapi.io/api/employee';

  constructor(private http:HttpClient) { }

  getAllEmployee() {
    return this.http.get<Employee[]>(this.URL);  
  }
}
