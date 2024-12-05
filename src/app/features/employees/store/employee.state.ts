import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Employee, EmployeeStatus } from '../models/employee.model';

export interface EmployeeState extends EntityState<Employee> {
  selectedEmployeeId: string | null;
  loading: boolean;
  error: string | null;
  statusFilter: EmployeeStatus | null;
}

export const employeeAdapter = createEntityAdapter<Employee>();

export const initialState: EmployeeState = employeeAdapter.getInitialState({
  selectedEmployeeId: null,
  loading: false,
  error: null,
  statusFilter: null
});
