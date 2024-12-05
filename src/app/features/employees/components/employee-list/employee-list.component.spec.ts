import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { Employee, EmployeeStatus } from '../../models/employee.model';
import { EmployeeActions } from '../../store/employee.actions';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let store: jasmine.SpyObj<Store>;
  let employeesSubject: BehaviorSubject<Employee[]>;

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      position: 'Developer',
      status: EmployeeStatus.ACTIVE,
      joiningDate: '2023-01-01'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      position: 'Designer',
      status: EmployeeStatus.INACTIVE,
      joiningDate: '2023-02-01'
    }
  ];

  beforeEach(async () => {
    employeesSubject = new BehaviorSubject<Employee[]>(mockEmployees);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(employeesSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [ EmployeeListComponent ],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEmployees action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.loadEmployees()
    );
  });

  it('should load employees from store', () => {
    expect(store.select).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockEmployees);
  });

  it('should filter employees by search text', fakeAsync(() => {
    const event = { target: { value: 'John' } } as unknown as KeyboardEvent;
    component.applyFilter(event);
    tick(300); // Debounce time
    expect(component.dataSource.filter).toBe('john');

    const filteredData = component.dataSource.filteredData;
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe('John Doe');
  }));

  it('should filter employees by status', () => {
    component.filterByStatus(EmployeeStatus.ACTIVE);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.filterByStatus({ status: EmployeeStatus.ACTIVE })
    );

    // Simulate store response with filtered data
    employeesSubject.next([mockEmployees[0]]);
    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].status).toBe(EmployeeStatus.ACTIVE);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass(EmployeeStatus.ACTIVE)).toBe('active');
    expect(component.getStatusClass(EmployeeStatus.INACTIVE)).toBe('inactive');
    expect(component.getStatusClass(EmployeeStatus.ON_LEAVE)).toBe('on_leave');
  });

  it('should initialize with correct columns', () => {
    expect(component.displayedColumns).toEqual([
      'avatar',
      'name',
      'email',
      'position',
      'status',
      'joiningDate',
      'actions'
    ]);
  });

  it('should initialize status options correctly', () => {
    expect(component.statusOptions).toEqual([
      { value: null, label: 'All Status' },
      { value: EmployeeStatus.ACTIVE, label: 'Active' },
      { value: EmployeeStatus.INACTIVE, label: 'Inactive' },
      { value: EmployeeStatus.ON_LEAVE, label: 'On Leave' }
    ]);
  });

  it('should handle empty search results', fakeAsync(() => {
    const event = { target: { value: 'NonexistentEmployee' } } as unknown as KeyboardEvent;
    component.applyFilter(event);
    tick(300);
    expect(component.dataSource.filteredData.length).toBe(0);
  }));

  it('should handle multiple filters combination', fakeAsync(() => {
    // First apply status filter
    component.filterByStatus(EmployeeStatus.ACTIVE);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.filterByStatus({ status: EmployeeStatus.ACTIVE })
    );

    // Simulate store response with filtered data
    employeesSubject.next([mockEmployees[0]]);
    fixture.detectChanges();

    // Then apply text filter
    const event = { target: { value: 'Developer' } } as unknown as KeyboardEvent;
    component.applyFilter(event);
    tick(300);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0]).toEqual(mockEmployees[0]);
  }));

  it('should clear filters when empty search is applied', fakeAsync(() => {
    // First apply status filter
    component.filterByStatus(EmployeeStatus.ACTIVE);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.filterByStatus({ status: EmployeeStatus.ACTIVE })
    );

    // Simulate store response with filtered data
    employeesSubject.next([mockEmployees[0]]);
    fixture.detectChanges();

    // Clear the filter
    component.filterByStatus(null);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.filterByStatus({ status: null })
    );

    // Simulate store response with all data
    employeesSubject.next(mockEmployees);
    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(mockEmployees.length);
  }));
});
