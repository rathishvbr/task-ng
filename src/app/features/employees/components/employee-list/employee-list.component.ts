import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Employee, EmployeeStatus } from '../../models/employee.model';
import { selectFilteredEmployees } from '../../store/employee.selectors';
import { EmployeeActions } from '../../store/employee.actions';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    'joiningDate',
    'actions'
  ];
  dataSource: MatTableDataSource<Employee>;
  statusOptions = [
    { value: null, label: 'All Status' },
    { value: EmployeeStatus.ACTIVE, label: 'Active' },
    { value: EmployeeStatus.INACTIVE, label: 'Inactive' },
    { value: EmployeeStatus.ON_LEAVE, label: 'On Leave' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {
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

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '_');
  }

  onDelete(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(EmployeeActions.deleteEmployee({ id: employee.id }));
      }
    });
  }
}
