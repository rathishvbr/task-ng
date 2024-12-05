import { Employee, EmployeeStatus } from '../models/employee.model';
import { EmployeeActions } from './employee.actions';

describe('Employee Actions', () => {
  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Developer',
    status: EmployeeStatus.ACTIVE,
    joiningDate: '2023-01-01'
  };

  it('should create loadEmployees action', () => {
    const action = EmployeeActions.loadEmployees();
    expect(action.type).toBe('[Employee] Load Employees');
  });

  it('should create loadEmployeesSuccess action', () => {
    const employees = [mockEmployee];
    const action = EmployeeActions.loadEmployeesSuccess({ employees });
    expect(action.type).toBe('[Employee] Load Employees Success');
    expect(action.employees).toEqual(employees);
  });

  it('should create loadEmployeesFailure action', () => {
    const error = 'Failed to load employees';
    const action = EmployeeActions.loadEmployeesFailure({ error });
    expect(action.type).toBe('[Employee] Load Employees Failure');
    expect(action.error).toBe(error);
  });

  it('should create loadEmployee action', () => {
    const action = EmployeeActions.loadEmployee({ id: '1' });
    expect(action.type).toBe('[Employee] Load Employee');
    expect(action.id).toBe('1');
  });

  it('should create loadEmployeeSuccess action', () => {
    const action = EmployeeActions.loadEmployeeSuccess({ employee: mockEmployee });
    expect(action.type).toBe('[Employee] Load Employee Success');
    expect(action.employee).toEqual(mockEmployee);
  });

  it('should create loadEmployeeFailure action', () => {
    const error = 'Failed to load employee';
    const action = EmployeeActions.loadEmployeeFailure({ error });
    expect(action.type).toBe('[Employee] Load Employee Failure');
    expect(action.error).toBe(error);
  });

  it('should create createEmployee action', () => {
    const { id, ...newEmployee } = mockEmployee;
    const action = EmployeeActions.createEmployee({ employee: newEmployee });
    expect(action.type).toBe('[Employee] Create Employee');
    expect(action.employee).toEqual(newEmployee);
  });

  it('should create createEmployeeSuccess action', () => {
    const action = EmployeeActions.createEmployeeSuccess({ employee: mockEmployee });
    expect(action.type).toBe('[Employee] Create Employee Success');
    expect(action.employee).toEqual(mockEmployee);
  });

  it('should create createEmployeeFailure action', () => {
    const error = 'Failed to create employee';
    const action = EmployeeActions.createEmployeeFailure({ error });
    expect(action.type).toBe('[Employee] Create Employee Failure');
    expect(action.error).toBe(error);
  });

  it('should create updateEmployee action', () => {
    const action = EmployeeActions.updateEmployee({ id: '1', employee: { name: 'Updated Name' } });
    expect(action.type).toBe('[Employee] Update Employee');
    expect(action.id).toBe('1');
    expect(action.employee).toEqual({ name: 'Updated Name' });
  });

  it('should create updateEmployeeSuccess action', () => {
    const action = EmployeeActions.updateEmployeeSuccess({ employee: mockEmployee });
    expect(action.type).toBe('[Employee] Update Employee Success');
    expect(action.employee).toEqual(mockEmployee);
  });

  it('should create updateEmployeeFailure action', () => {
    const error = 'Failed to update employee';
    const action = EmployeeActions.updateEmployeeFailure({ error });
    expect(action.type).toBe('[Employee] Update Employee Failure');
    expect(action.error).toBe(error);
  });

  it('should create deleteEmployee action', () => {
    const action = EmployeeActions.deleteEmployee({ id: '1' });
    expect(action.type).toBe('[Employee] Delete Employee');
    expect(action.id).toBe('1');
  });

  it('should create deleteEmployeeSuccess action', () => {
    const action = EmployeeActions.deleteEmployeeSuccess({ id: '1' });
    expect(action.type).toBe('[Employee] Delete Employee Success');
    expect(action.id).toBe('1');
  });

  it('should create deleteEmployeeFailure action', () => {
    const error = 'Failed to delete employee';
    const action = EmployeeActions.deleteEmployeeFailure({ error });
    expect(action.type).toBe('[Employee] Delete Employee Failure');
    expect(action.error).toBe(error);
  });
});
