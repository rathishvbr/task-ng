import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee, EmployeeStatus } from '../../models/employee.model';
import { selectFilteredEmployees } from '../../store/employee.selectors';
import { EmployeeActions } from '../../store/employee.actions';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'avatar',
    'name',
    'email',
    'position',
    'status',
    'joiningDate'
  ];
  dataSource: MatTableDataSource<Employee>;
  statusOptions = Object.values(EmployeeStatus);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store) {
    this.dataSource = new MatTableDataSource<Employee>();
  }

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());

    this.store.select(selectFilteredEmployees).subscribe(employees => {
      this.dataSource.data = employees;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByStatus(status: EmployeeStatus | null) {
    this.store.dispatch(EmployeeActions.filterByStatus({ status }));
  }
}
