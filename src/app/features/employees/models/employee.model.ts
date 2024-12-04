export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  status: EmployeeStatus;
  joiningDate: string;
}
