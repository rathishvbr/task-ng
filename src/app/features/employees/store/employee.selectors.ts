import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdapter } from './employee.state';

const { selectAll } = employeeAdapter.getSelectors();
const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  selectAll
);

export const selectStatusFilter = createSelector(
  selectEmployeeState,
  state => state.statusFilter
);

export const selectFilteredEmployees = createSelector(
  selectAllEmployees,
  selectStatusFilter,
  (employees, statusFilter) => {
    if (!statusFilter) return employees;
    return employees.filter(employee => employee.status === statusFilter);
  }
);
