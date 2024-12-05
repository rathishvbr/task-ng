export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave'
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  status: EmployeeStatus;
  joiningDate: string;
}
