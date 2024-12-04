import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Employee } from '../models/employee.model';

export interface EmployeeState extends EntityState<Employee> {
  selectedEmployeeId: string | null;
  loading: boolean;
  error: string | null;
  filter: string;
  statusFilter: Employee['status'] | null;
}

export const employeeAdapter = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => employee.id
});

export const initialState: EmployeeState = employeeAdapter.getInitialState({
  selectedEmployeeId: null,
  loading: false,
  error: null,
  filter: '',
  statusFilter: null
});
