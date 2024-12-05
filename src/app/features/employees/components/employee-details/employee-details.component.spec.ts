import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { EmployeeDetailsComponent } from './employee-details.component';
import { EmployeeStatus } from '../../models/employee.model';
import { EmployeeActions } from '../../store/employee.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EmployeeDetailsComponent', () => {
  let component: EmployeeDetailsComponent;
  let fixture: ComponentFixture<EmployeeDetailsComponent>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;
  let route: Partial<ActivatedRoute>;
  let paramMap: jasmine.SpyObj<ParamMap>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    paramMap = jasmine.createSpyObj<ParamMap>('ParamMap', ['get', 'getAll', 'has', 'keys']);
    paramMap.get.and.returnValue(null);
    storeSpy.select.and.returnValue(of(null));

    const mockSnapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap,
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: 'primary',
      component: null,
      routeConfig: null,
      children: [],
      pathFromRoot: []
    };

    Object.defineProperty(mockSnapshot, 'root', {
      get: () => mockSnapshot
    });
    Object.defineProperty(mockSnapshot, 'parent', {
      get: () => null
    });
    Object.defineProperty(mockSnapshot, 'firstChild', {
      get: () => null
    });

    route = {
      snapshot: mockSnapshot as ActivatedRouteSnapshot
    };

    await TestBed.configureTestingModule({
      declarations: [EmployeeDetailsComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.employeeForm.get('name')?.value).toBe('');
    expect(component.employeeForm.get('email')?.value).toBe('');
    expect(component.employeeForm.get('position')?.value).toBe('');
    expect(component.employeeForm.get('status')?.value).toBe(EmployeeStatus.ACTIVE);
    expect(component.employeeForm.get('joiningDate')?.value).toBeInstanceOf(Date);
  });

  it('should validate required fields', () => {
    const form = component.employeeForm;
    expect(form.valid).toBeFalsy();

    form.controls['name'].setValue('John Doe');
    form.controls['email'].setValue('invalid-email');
    expect(form.controls['email'].errors?.['email']).toBeTruthy();

    form.controls['email'].setValue('john@example.com');
    form.controls['position'].setValue('Developer');
    form.controls['status'].setValue(EmployeeStatus.ACTIVE);
    form.controls['joiningDate'].setValue(new Date());

    expect(form.valid).toBeTruthy();
  });

  it('should create new employee', () => {
    const newEmployee = {
      name: 'John Doe',
      email: 'john@example.com',
      position: 'Developer',
      status: EmployeeStatus.ACTIVE,
      joiningDate: new Date('2023-01-01').toISOString().split('T')[0]
    };

    component.employeeForm.patchValue({
      ...newEmployee,
      joiningDate: new Date('2023-01-01')
    });

    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.createEmployee({ employee: newEmployee })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should update existing employee', () => {
    // Set up edit mode
    paramMap.get.and.returnValue('1');
    component.isEditMode = true;

    const updatedEmployee = {
      name: 'Updated Name',
      email: 'updated@example.com',
      position: 'Senior Developer',
      status: EmployeeStatus.ACTIVE,
      joiningDate: new Date('2023-02-01')
    };

    component.employeeForm.patchValue(updatedEmployee);
    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.updateEmployee({
        id: '1',
        employee: {
          ...updatedEmployee,
          joiningDate: updatedEmployee.joiningDate.toISOString().split('T')[0]
        }
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should handle form cancellation', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should show correct error messages', () => {
    expect(component.getErrorMessage('name')).toBe('Name is required');

    component.employeeForm.controls['email'].setValue('invalid-email');
    expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');

    component.employeeForm.controls['name'].setValue('a');
    expect(component.getErrorMessage('name')).toBe('Name must be at least 2 characters');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass(EmployeeStatus.ACTIVE)).toBe('active');
    expect(component.getStatusClass(EmployeeStatus.INACTIVE)).toBe('inactive');
    expect(component.getStatusClass(EmployeeStatus.ON_LEAVE)).toBe('on_leave');
  });
});
