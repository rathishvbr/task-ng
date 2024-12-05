import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { selectAllEmployees } from '../../store/employee.selectors';
import { EmployeeActions } from '../../store/employee.actions';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;

  constructor(private store: Store) {
    this.employees$ = this.store.select(selectAllEmployees);
  }

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }
}
