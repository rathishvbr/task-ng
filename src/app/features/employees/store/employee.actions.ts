import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Employee } from '../models/employee.model';

export const EmployeeActions = createActionGroup({
  source: 'Employee',
  events: {
    // Load Employees
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: Employee[] }>(),
    'Load Employees Failure': props<{ error: string }>(),

    // Load Single Employee
    'Load Employee': props<{ id: string }>(),
    'Load Employee Success': props<{ employee: Employee }>(),
    'Load Employee Failure': props<{ error: string }>(),

    // Create Employee
    'Create Employee': props<{ employee: Omit<Employee, 'id'> }>(),
    'Create Employee Success': props<{ employee: Employee }>(),
    'Create Employee Failure': props<{ error: string }>(),

    // Update Employee
    'Update Employee': props<{ id: string; employee: Partial<Employee> }>(),
    'Update Employee Success': props<{ employee: Employee }>(),
    'Update Employee Failure': props<{ error: string }>(),

    // Delete Employee
    'Delete Employee': props<{ id: string }>(),
    'Delete Employee Success': props<{ id: string }>(),
    'Delete Employee Failure': props<{ error: string }>(),

    // Filter Employees
    'Filter Employees': props<{ query: string }>(),
    'Filter By Status': props<{ status: Employee['status'] | null }>(),

    'Select Employee': props<{ employee: Employee }>()
  }
});
