import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdapter } from './employee.state';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

const { selectAll, selectEntities } = employeeAdapter.getSelectors();

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  selectAll
);

export const selectEmployeeEntities = createSelector(
  selectEmployeeState,
  selectEntities
);

export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state) => state.selectedEmployeeId
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectEmployeeLoading = createSelector(
  selectEmployeeState,
  (state) => state.loading
);

export const selectEmployeeError = createSelector(
  selectEmployeeState,
  (state) => state.error
);

export const selectEmployeeFilter = createSelector(
  selectEmployeeState,
  (state) => state.filter
);

export const selectEmployeeStatusFilter = createSelector(
  selectEmployeeState,
  (state) => state.statusFilter
);

export const selectFilteredEmployees = createSelector(
  selectAllEmployees,
  selectEmployeeFilter,
  selectEmployeeStatusFilter,
  (employees, filter, statusFilter) => {
    let filteredEmployees = employees;

    if (filter) {
      const lowercaseFilter = filter.toLowerCase();
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.name.toLowerCase().includes(lowercaseFilter) ||
        employee.email.toLowerCase().includes(lowercaseFilter) ||
        employee.position.toLowerCase().includes(lowercaseFilter)
      );
    }

    if (statusFilter) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.status === statusFilter
      );
    }

    return filteredEmployees;
  }
);
