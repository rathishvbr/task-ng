import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Employee, EmployeeStatus } from '../../models/employee.model';
import { selectFilteredEmployees } from '../../store/employee.selectors';
import { EmployeeActions } from '../../store/employee.actions';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface ListState {
  pageIndex: number;
  pageSize: number;
  filter: string;
  statusFilter: EmployeeStatus | null;
  sortActive: string;
  sortDirection: 'asc' | 'desc' | '';
}

const LIST_STATE_KEY = 'employeeListState';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
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

  // Public properties for template binding
  pageSize = 15;
  pageIndex = 0;
  filterValue = '';
  selectedStatus: EmployeeStatus | null = null;
  sortActive = 'name';
  sortDirection: 'asc' | 'desc' | '' = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private listState: ListState = {
    pageIndex: 0,
    pageSize: 15,
    filter: '',
    statusFilter: null,
    sortActive: 'name',
    sortDirection: 'asc'
  };

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Employee>();
    this.loadState();

    // Configure custom filter predicate
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchStr) ||
             data.email.toLowerCase().includes(searchStr) ||
             data.position.toLowerCase().includes(searchStr);
    };
  }

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());

    this.store.select(selectFilteredEmployees).subscribe(employees => {
      this.dataSource.data = employees;

      // Apply saved filters
      if (this.filterValue) {
        this.dataSource.filter = this.filterValue.toLowerCase();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Set saved pagination state
    if (this.paginator) {
      this.pageIndex = this.listState.pageIndex;
      this.pageSize = this.listState.pageSize;
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;
    }

    // Set saved sort state
    if (this.sort) {
      this.sort.active = this.listState.sortActive;
      this.sort.direction = this.listState.sortDirection;
    }

    // Apply saved status filter if exists
    if (this.selectedStatus) {
      this.store.dispatch(EmployeeActions.filterByStatus({ status: this.selectedStatus }));
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.listState.filter = filterValue;
    this.saveState();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.pageIndex = 0;
      this.listState.pageIndex = 0;
      this.saveState();
    }
  }

  filterByStatus(status: EmployeeStatus | null) {
    this.selectedStatus = status;
    this.store.dispatch(EmployeeActions.filterByStatus({ status }));
    this.listState.statusFilter = status;
    this.saveState();

    // Reset pagination when filter changes
    if (this.paginator) {
      this.paginator.firstPage();
      this.pageIndex = 0;
      this.listState.pageIndex = 0;
      this.saveState();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listState.pageIndex = event.pageIndex;
    this.listState.pageSize = event.pageSize;
    this.saveState();
  }

  onSort(event: Sort) {
    this.sortActive = event.active;
    this.sortDirection = event.direction;
    this.listState.sortActive = event.active;
    this.listState.sortDirection = event.direction;
    this.saveState();
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

  private loadState() {
    const savedState = localStorage.getItem(LIST_STATE_KEY);
    if (savedState) {
      this.listState = JSON.parse(savedState);
      this.pageIndex = this.listState.pageIndex;
      this.pageSize = this.listState.pageSize;
      this.filterValue = this.listState.filter;
      this.selectedStatus = this.listState.statusFilter;
      this.sortActive = this.listState.sortActive;
      this.sortDirection = this.listState.sortDirection;
    }
  }

  private saveState() {
    localStorage.setItem(LIST_STATE_KEY, JSON.stringify(this.listState));
  }

  hasActiveFilters(): boolean {
    return !!(this.filterValue || this.selectedStatus);
  }

  clearTextFilter(): void {
    this.filterValue = '';
    this.listState.filter = '';
    this.dataSource.filter = '';
    this.saveState();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.pageIndex = 0;
      this.listState.pageIndex = 0;
      this.saveState();
    }
  }

  clearAllFilters(): void {
    // Clear text filter
    this.clearTextFilter();

    // Clear status filter
    this.selectedStatus = null;
    this.listState.statusFilter = null;
    this.store.dispatch(EmployeeActions.filterByStatus({ status: null }));
    this.saveState();

    // Reset pagination
    if (this.paginator) {
      this.paginator.firstPage();
      this.pageIndex = 0;
      this.listState.pageIndex = 0;
      this.saveState();
    }
  }
}
