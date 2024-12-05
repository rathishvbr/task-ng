import { Employee, EmployeeStatus } from '../models/employee.model';
import { EmployeeActions } from './employee.actions';
import { employeeReducer } from './employee.reducer';
import { EmployeeState, initialState } from './employee.state';

describe('Employee Reducer', () => {
  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Developer',
    status: EmployeeStatus.ACTIVE,
    joiningDate: '2023-01-01'
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = employeeReducer(initialState, action);
      expect(state).toBe(initialState);
    });
  });

  describe('loadEmployees actions', () => {
    it('should set loading to true', () => {
      const action = EmployeeActions.loadEmployees();
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set employees on success', () => {
      const employees = [mockEmployee];
      const action = EmployeeActions.loadEmployeesSuccess({ employees });
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.ids).toEqual([mockEmployee.id]);
    });

    it('should set error on failure', () => {
      const error = 'Failed to load employees';
      const action = EmployeeActions.loadEmployeesFailure({ error });
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('loadEmployee actions', () => {
    it('should set loading to true', () => {
      const action = EmployeeActions.loadEmployee({ id: '1' });
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set employee on success', () => {
      const action = EmployeeActions.loadEmployeeSuccess({ employee: mockEmployee });
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.entities[mockEmployee.id]).toEqual(mockEmployee);
    });

    it('should set error on failure', () => {
      const error = 'Failed to load employee';
      const action = EmployeeActions.loadEmployeeFailure({ error });
      const state = employeeReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('createEmployee actions', () => {
    const { id, ...newEmployee } = mockEmployee;

    it('should add employee on success', () => {
      const action = EmployeeActions.createEmployeeSuccess({ employee: mockEmployee });
      const state = employeeReducer(initialState, action);
      expect(state.entities[mockEmployee.id]).toEqual(mockEmployee);
    });

    it('should set error on failure', () => {
      const error = 'Failed to create employee';
      const action = EmployeeActions.createEmployeeFailure({ error });
      const state = employeeReducer(initialState, action);
      expect(state.error).toBe(error);
    });
  });

  describe('updateEmployee actions', () => {
    let state: EmployeeState;

    beforeEach(() => {
      state = employeeReducer(initialState, EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] }));
    });

    it('should update employee on success', () => {
      const updatedEmployee: Employee = {
        ...mockEmployee,
        name: 'Updated Name'
      };
      const action = EmployeeActions.updateEmployeeSuccess({ employee: updatedEmployee });
      state = employeeReducer(state, action);
      expect(state.entities[mockEmployee.id]?.name).toBe('Updated Name');
    });

    it('should set error on failure', () => {
      const error = 'Failed to update employee';
      const action = EmployeeActions.updateEmployeeFailure({ error });
      state = employeeReducer(state, action);
      expect(state.error).toBe(error);
    });
  });

  describe('deleteEmployee actions', () => {
    let state: EmployeeState;

    beforeEach(() => {
      state = employeeReducer(initialState, EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] }));
    });

    it('should remove employee on success', () => {
      const action = EmployeeActions.deleteEmployeeSuccess({ id: mockEmployee.id });
      state = employeeReducer(state, action);
      expect(state.entities[mockEmployee.id]).toBeUndefined();
    });

    it('should set error on failure', () => {
      const error = 'Failed to delete employee';
      const action = EmployeeActions.deleteEmployeeFailure({ error });
      state = employeeReducer(state, action);
      expect(state.error).toBe(error);
    });
  });

  describe('integration tests', () => {
    let state: EmployeeState;

    beforeEach(() => {
      state = initialState;
    });

    it('should handle a sequence of actions', () => {
      // Load employees
      const employees = [mockEmployee];
      state = employeeReducer(state, EmployeeActions.loadEmployeesSuccess({ employees }));
      expect(state.ids.length).toBe(1);

      // Create new employee
      const newEmployee: Employee = {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        position: 'Designer',
        status: EmployeeStatus.ACTIVE,
        joiningDate: '2023-02-01'
      };
      state = employeeReducer(state, EmployeeActions.createEmployeeSuccess({ employee: newEmployee }));
      expect(state.ids.length).toBe(2);

      // Update employee
      const updatedEmployee = { ...newEmployee, name: 'Updated Name' };
      state = employeeReducer(state, EmployeeActions.updateEmployeeSuccess({ employee: updatedEmployee }));
      expect(state.entities[2]?.name).toBe('Updated Name');

      // Delete employee
      state = employeeReducer(state, EmployeeActions.deleteEmployeeSuccess({ id: '2' }));
      expect(state.ids.length).toBe(1);
    });
  });
});
