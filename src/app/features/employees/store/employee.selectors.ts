import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdapter } from './employee.state';
import { Employee } from '../models/employee.model';

const { selectAll, selectEntities } = employeeAdapter.getSelectors();
export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

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

export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state) => state.selectedEmployeeId
);

export const selectEmployeeEntities = createSelector(
  selectEmployeeState,
  selectEntities
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, selectedId): Employee | null => {
    if (!selectedId) return null;
    const employee = entities[selectedId];
    return employee || null;
  }
);
