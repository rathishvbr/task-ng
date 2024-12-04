import { createReducer, on } from '@ngrx/store';
import { EmployeeActions } from './employee.actions';
import { employeeAdapter, initialState } from './employee.state';

export const employeeReducer = createReducer(
  initialState,

  // Load Employees
  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, { ...state, loading: false })
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single Employee
  on(EmployeeActions.loadEmployee, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeeActions.loadEmployeeSuccess, (state, { employee }) => ({
    ...employeeAdapter.upsertOne(employee, state),
    selectedEmployeeId: employee.id,
    loading: false
  })),
  on(EmployeeActions.loadEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Employee
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, state)
  ),
  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Update Employee
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.updateOne({ id: employee.id, changes: employee }, state)
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Delete Employee
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, state)
  ),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Filters
  on(EmployeeActions.filterEmployees, (state, { query }) => ({
    ...state,
    filter: query
  })),
  on(EmployeeActions.filterByStatus, (state, { status }) => ({
    ...state,
    statusFilter: status
  })),

  // Select Employee
  on(EmployeeActions.selectEmployee, (state, { employee }) => ({
    ...state,
    selectedEmployeeId: employee.id.toString(),
  }))
);
