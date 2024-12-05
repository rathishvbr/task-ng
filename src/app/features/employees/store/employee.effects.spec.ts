import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { EmployeeEffects } from './employee.effects';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeStatus } from '../models/employee.model';
import { EmployeeActions } from './employee.actions';
import { cold, hot } from 'jasmine-marbles';

describe('EmployeeEffects', () => {
  let actions$: Observable<Action>;
  let effects: EmployeeEffects;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Developer',
    status: EmployeeStatus.ACTIVE,
    joiningDate: '2023-01-01'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EmployeeService', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete'
    ]);
    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideMockActions(() => actions$),
        { provide: EmployeeService, useValue: spy }
      ]
    });

    effects = TestBed.inject(EmployeeEffects);
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadEmployees$', () => {
    it('should return loadEmployeesSuccess with employees on success', () => {
      const employees = [mockEmployee];
      const action = EmployeeActions.loadEmployees();
      const completion = EmployeeActions.loadEmployeesSuccess({ employees });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: employees });
      employeeService.getAll.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.loadEmployees$).toBeObservable(expected);
    });

    it('should return loadEmployeesFailure on error', () => {
      const action = EmployeeActions.loadEmployees();
      const error = new Error('Error loading employees');
      const completion = EmployeeActions.loadEmployeesFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      employeeService.getAll.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.loadEmployees$).toBeObservable(expected);
    });
  });

  describe('loadEmployee$', () => {
    it('should return loadEmployeeSuccess with employee on success', () => {
      const action = EmployeeActions.loadEmployee({ id: '1' });
      const completion = EmployeeActions.loadEmployeeSuccess({ employee: mockEmployee });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: mockEmployee });
      employeeService.getById.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.loadEmployee$).toBeObservable(expected);
    });

    it('should return loadEmployeeFailure on error', () => {
      const action = EmployeeActions.loadEmployee({ id: '1' });
      const error = new Error('Error loading employee');
      const completion = EmployeeActions.loadEmployeeFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      employeeService.getById.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.loadEmployee$).toBeObservable(expected);
    });
  });

  describe('createEmployee$', () => {
    const { id, ...newEmployee } = mockEmployee;

    it('should return createEmployeeSuccess with employee on success', () => {
      const action = EmployeeActions.createEmployee({ employee: newEmployee });
      const completion = EmployeeActions.createEmployeeSuccess({ employee: mockEmployee });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: mockEmployee });
      employeeService.create.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.createEmployee$).toBeObservable(expected);
    });

    it('should return createEmployeeFailure on error', () => {
      const action = EmployeeActions.createEmployee({ employee: newEmployee });
      const error = new Error('Error creating employee');
      const completion = EmployeeActions.createEmployeeFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      employeeService.create.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.createEmployee$).toBeObservable(expected);
    });
  });

  describe('updateEmployee$', () => {
    it('should return updateEmployeeSuccess with employee on success', () => {
      const action = EmployeeActions.updateEmployee({ id: '1', employee: { name: 'Updated Name' } });
      const completion = EmployeeActions.updateEmployeeSuccess({ employee: mockEmployee });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: mockEmployee });
      employeeService.update.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.updateEmployee$).toBeObservable(expected);
    });

    it('should return updateEmployeeFailure on error', () => {
      const action = EmployeeActions.updateEmployee({ id: '1', employee: { name: 'Updated Name' } });
      const error = new Error('Error updating employee');
      const completion = EmployeeActions.updateEmployeeFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      employeeService.update.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.updateEmployee$).toBeObservable(expected);
    });
  });

  describe('deleteEmployee$', () => {
    it('should return deleteEmployeeSuccess with id on success', () => {
      const action = EmployeeActions.deleteEmployee({ id: '1' });
      const completion = EmployeeActions.deleteEmployeeSuccess({ id: '1' });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: undefined });
      employeeService.delete.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.deleteEmployee$).toBeObservable(expected);
    });

    it('should return deleteEmployeeFailure on error', () => {
      const action = EmployeeActions.deleteEmployee({ id: '1' });
      const error = new Error('Error deleting employee');
      const completion = EmployeeActions.deleteEmployeeFailure({ error: error.message });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      employeeService.delete.and.returnValue(response);

      const expected = cold('--b', { b: completion });
      expect(effects.deleteEmployee$).toBeObservable(expected);
    });
  });
});
